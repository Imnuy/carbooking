import pool from './db';

export async function sendNotification(message: string, userId: number = 1) {
  try {
    const [settings]: any = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );

    if (!settings || settings.length === 0) return;

    const s = settings[0];

    // Line Notification
    if (s.line_notification && s.line_token) {
      try {
        await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${s.line_token}`
          },
          body: new URLSearchParams({ message }).toString()
        });
      } catch (err) {
        console.error('Line notify error:', err);
      }
    }

    // Telegram Notification
    if (s.telegram_notification && s.telegram_bot_token && s.telegram_chat_id) {
      try {
        await fetch(`https://api.telegram.org/bot${s.telegram_bot_token}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: s.telegram_chat_id,
            text: message,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.error('Telegram notify error:', err);
      }
    }
  } catch (err) {
    console.error('Notification utility error:', err);
  }
}
