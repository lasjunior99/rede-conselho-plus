import emailjs from '@emailjs/browser';

// Estas chaves devem ser preenchidas com os dados do console do EmailJS
const EMAIL_SERVICE_ID = "service_r9f0i6j";
const EMAIL_TEMPLATE_ID_CONTACT = "template_cywn75d"; // Template para notificar o Admin
const EMAIL_TEMPLATE_ID_REPLY = "template_0okgrjf"; // Template para responder ao usuário
const EMAIL_PUBLIC_KEY = "Pb5NJJKnSwIX5kkiq";

export const sendContactNotification = async (data: any, recipientEmails: string[] = ['diretoria@conselhomais.com.br']) => {
    try {
        // Enviar e-mail para cada destinatário da lista
        const sendPromises = recipientEmails.map(recipientEmail =>
            emailjs.send(
                EMAIL_SERVICE_ID,
                EMAIL_TEMPLATE_ID_CONTACT,
                {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.content,
                    company: data.company || 'N/A',
                    to_email: recipientEmail
                },
                EMAIL_PUBLIC_KEY
            )
        );

        const responses = await Promise.all(sendPromises);
        console.log(`[EmailJS] Notificações enviadas para ${recipientEmails.length} destinatário(s):`, recipientEmails);
        return responses;
    } catch (error) {
        console.error("[EmailJS] Erro ao enviar e-mail de contato:", error);
        throw error;
    }
};

export const sendReplyEmail = async (data: any) => {
    try {
        const response = await emailjs.send(
            EMAIL_SERVICE_ID,
            EMAIL_TEMPLATE_ID_REPLY,
            {
                to_name: data.name,
                to_email: data.email,
                reply_message: data.reply,
                original_subject: data.subject
            },
            EMAIL_PUBLIC_KEY
        );
        return response;
    } catch (error) {
        console.error("Erro ao enviar e-mail de resposta:", error);
        throw error;
    }
};
