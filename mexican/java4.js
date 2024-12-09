document.getElementById('designers-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const discordId = formData.get('discord-id');

    const lastSubmitted = localStorage.getItem(`lastSubmitted_${discordId}`);
    const now = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (lastSubmitted && (now - lastSubmitted) < oneWeek) {
        showNotification('يمكنك التقديم مرة أخرى بعد مرور أسبوع كامل.');
        return;
    }

    const webhookURL = 'https://discord.com/api/webhooks/1312466422148104193/ccCLf_hha-6jipV1MbSB7SXYY0k73QFtlZw9d_9AaHJvO_9tRUGfasIzm8D3KgMhGflG';
    const payload = {
        content: `New Designer Application:\n**Real Name:** ${formData.get('real-name')}\n**Age:** ${formData.get('age')}\n**Discord Username:** ${formData.get('discord-username')}\n**Discord ID:** ${discordId}\n**Experience:** ${formData.get('experience')}\n**Daily Activity:** ${formData.get('activity')}\n**Works:** ${formData.get('works')}`
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            const files = formData.getAll('uploads');
            if (files && files.length > 0) {
                const uploadPromises = files.map(file => {
                    const filePayload = new FormData();
                    filePayload.append('file', file, file.name);
                    return fetch(webhookURL, {
                        method: 'POST',
                        body: filePayload
                    });
                });
                return Promise.all(uploadPromises);
            }
            return Promise.resolve();
        } else {
            throw new Error('Failed to send application.');
        }
    })
    .then(() => {
        localStorage.setItem(`lastSubmitted_${discordId}`, now);
        showNotification('تم إرسال الطلب بنجاح!');
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('حدث خطأ. حاول مرة أخرى.');
    });
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000); // إخفاء الإشعار بعد 3 ثواني
}
