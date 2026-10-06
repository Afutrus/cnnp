export default async function handler(req, res) {
    // Hanya menerima POST
    if (req.method !== "POST") {
        return res.status(405).json({
            ok: false,
            error: "Method Not Allowed"
        });
    }

    try {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // Pastikan environment variable tersedia
        if (!token || !chatId) {
            console.error("Telegram environment variable belum diset.");

            return res.status(500).json({
                ok: false,
                error: "Telegram configuration belum diset di Vercel"
            });
        }

        /*
         * Karena browser mengirim multipart/form-data,
         * kita membaca request body sebagai FormData.
         */
        const formData = await req.formData();

        const photo = formData.get("photo");
        const caption = formData.get("caption");

        if (!photo) {
            return res.status(400).json({
                ok: false,
                error: "Foto tidak ditemukan"
            });
        }

        // Buat FormData baru untuk Telegram
        const telegramForm = new FormData();

        telegramForm.append("chat_id", chatId);
        telegramForm.append("photo", photo);

        if (caption) {
            telegramForm.append("caption", caption);
            telegramForm.append("parse_mode", "Markdown");
        }

        // Kirim ke Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${token}/sendPhoto`,
            {
                method: "POST",
                body: telegramForm
            }
        );

        const result = await telegramResponse.json();

        console.log("Telegram response:", result);

        if (!telegramResponse.ok || !result.ok) {
            return res.status(500).json({
                ok: false,
                error: result.description || "Telegram API gagal",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Berhasil dikirim ke Telegram"
        });

    } catch (error) {
        console.error("BONGKAR API ERROR:", error);

        return res.status(500).json({
            ok: false,
            error: error.message || "Internal Server Error"
        });
    }
}
