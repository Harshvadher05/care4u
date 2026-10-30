import { meetingQueue } from "../queues/meeting.queue.js";

export const scheduleMeetingLinkSender = async (
    appointmentId: bigint,
    doctorId: bigint,
    patientId: bigint,
    startTime: Date,
    reminderTime: Date,
    slotDuration: number
): Promise<void> => {
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const reminder = reminderTime instanceof Date ? reminderTime : new Date(reminderTime);
    const delay = Math.max(0, reminder.getTime() - Date.now());
    const isMeetingTimePassed = start.getTime() - Date.now();
    if (isMeetingTimePassed < 0) {  
        return;
    }
        
    await meetingQueue.add(
        "meeting-link",
        {
            appointmentId: appointmentId.toString(),
            doctorId: doctorId.toString(),
            patientId: patientId.toString(),
            startTime: start.toISOString(),
            slotDuration: slotDuration.toString()
        },
        {
            delay,
            jobId: `meeting-${appointmentId.toString()}`,
        }
    );
};

export const removeMeetingLinkSender = async (
    appointmentId: bigint,
): Promise<void> => {
    const jobId = `meeting-${appointmentId.toString()}`;

    const job = await meetingQueue.getJob(jobId);

    if (job) {
        await job.remove();
    }
};
