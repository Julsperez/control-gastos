import pathlib

import resend

from app.config import settings

_TEMPLATE_PATH = pathlib.Path(__file__).parent.parent.parent / "template_recuperacion_v1.html"
_TEMPLATE = _TEMPLATE_PATH.read_text(encoding="utf-8")


def send_reset_email(to_email: str, reset_url: str) -> None:
    html = (
        _TEMPLATE
        .replace("{{ reset_url }}", reset_url)
        .replace("NombreDeTuApp", "Control de Gastos")
    )
    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        "from": "studio@julsperez.com",
        "to": [to_email],
        "subject": "Restablece tu contraseña — Control de Gastos",
        "html": html,
    })
