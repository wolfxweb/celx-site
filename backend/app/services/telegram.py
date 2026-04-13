import httpx
from app.core.config import get_settings

settings = get_settings()


async def send_telegram_message(text: str) -> bool:
    """Send a message via Telegram bot."""
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "HTML",
    }
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(url, json=payload, timeout=10)
            return r.status_code == 200
        except Exception:
            return False


def format_contact_message(name: str, email: str, message: str) -> str:
    return (
        f"<b>📬 Nova mensagem do site celx</b>\n\n"
        f"<b>Nome:</b> {name}\n"
        f"<b>Email:</b> {email}\n\n"
        f"<b>Mensagem:</b>\n{message}"
    )
