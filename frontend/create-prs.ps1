
$ErrorActionPreference = "Stop"

# Care4U GitHub repository
$Repo = "Harshvadher05/care4u"
$TasksRoot = Join-Path (Get-Location).Path "pr-changes"
$WorkRoot = Join-Path $env:TEMP "care4u-pr-worktrees"

$Accounts = @(
    "piyush1645",
    "Harshvadher05",
    "ck-k9"
)

# Validate repository and task folders
git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    throw "Run from inside your care4u repository."
}

if ((git status --porcelain).Count -gt 0) {
    throw "Your working tree has changes. Save or commit them first."
}

if (-not (Test-Path $TasksRoot)) {
    throw "Create pr-changes and add folders containing real code changes."
}

gh auth status
if ($LASTEXITCODE -ne 0) {
    throw "Authenticate all contributor accounts with gh auth login first."
}

$RepoInfo = gh repo view $Repo --json defaultBranchRef |
    ConvertFrom-Json

if (-not $RepoInfo.defaultBranchRef) {
    throw "Could not determine the repository's default branch."
}
$Base = $RepoInfo.defaultBranchRef.name

git fetch origin
if ($LASTEXITCODE -ne 0) {
    throw "Fetch failed. Check repository access."
}

$Tasks = @(Get-ChildItem $TasksRoot -Directory | Sort-Object Name)
if ($Tasks.Count -eq 0) {
    throw "No task folders found."
}

# Confirm all accounts are available before processing tasks.
foreach ($Account in $Accounts) {
    gh auth switch --user $Account
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot switch to $Account. Authenticate that account first."
    }

    $Login = gh api user --jq .login
    if ($LASTEXITCODE -ne 0 -or $Login -ne $Account) {
        throw "Could not verify GitHub account $Account."
    }
}

New-Item -ItemType Directory -Force $WorkRoot | Out-Null

for ($i = 0; $i -lt $Tasks.Count; $i++) {
    $Task = $Tasks[$i]
    $Account = $Accounts[$i % $Accounts.Count]

    $Slug = $Task.Name -replace '[^a-zA-Z0-9-]', '-'
    $Branch = "feature/$Slug"
    $Worktree = Join-Path $WorkRoot $Slug

    Write-Host "`nTask: $($Task.Name)" -ForegroundColor Cyan
    Write-Host "Contributor: $Account"

    # Authenticate the actual contributor, not just the author name.
    gh auth switch --user $Account
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Cannot switch account. Skipping $Branch."
        continue
    }

    # Skip branches already present locally or remotely.
    git show-ref --verify --quiet "refs/heads/$Branch"
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "Local branch exists; skipping $Branch."
        continue
    }

    git ls-remote --exit-code --heads origin $Branch *> $null
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "Remote branch exists; skipping $Branch."
        continue
    }

    # Start independently from the current base branch.
    git worktree add -b $Branch $Worktree "origin/$Base"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Could not create $Branch."
        continue
    }

    try {
        Get-ChildItem $Task.FullName -Force | ForEach-Object {
            Copy-Item -LiteralPath $_.FullName `
                -Destination $Worktree -Recurse -Force
        }

        Push-Location $Worktree
        try {
            git add -A
            if ($LASTEXITCODE -ne 0) {
                throw "Could not stage files for $Branch."
            }

            git diff --cached --quiet
            if ($LASTEXITCODE -eq 0) {
                Write-Warning "No actual changes in $Branch; skipping."
                continue
            }

            $Staged = @(git diff --cached --name-only)
            if ($Staged | Where-Object {
                $_ -match '(^|/)\.env($|\.)' -or
                $_ -match '(^|/)(node_modules|bin|obj)/'
            }) {
                throw "Review staged files for secrets or generated files."
            }

            # Use the configured identity for this contributor.
            $IdentityName = git config user.name
            $IdentityEmail = git config user.email

            if (-not $IdentityName -or -not $IdentityEmail) {
                throw "Configure user.name and user.email for $Account before running."
            }

            git commit -m "feat: implement $Slug"
            if ($LASTEXITCODE -ne 0) {
                throw "Commit failed for $Branch."
            }

            git push -u origin $Branch
            if ($LASTEXITCODE -ne 0) {
                throw "Push failed for $Branch."
            }

            gh pr create `
                --repo $Repo `
                --base $Base `
                --head $Branch `
                --title "Implement $Slug" `
                --body "Implements the changes in task folder $($Task.Name). Please review and test."

            if ($LASTEXITCODE -ne 0) {
                Write-Warning "PR creation failed for $Branch. Check GitHub."
            }
        }
        finally {
            Pop-Location
        }
    }
    finally {
        git worktree remove --force $Worktree
    }
}

Write-Host "`nTask processing complete." -ForegroundColor Green
gh pr list --repo $Repo --state all
