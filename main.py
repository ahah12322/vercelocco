import requests
import os
import msvcrt
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table

CONTINUE_MESSAGE = "Nhấn Enter để tiếp tục..."
console = Console()


def clear_screen():
    os.system("cls")


def show_header(title):
    header_text = Text(title, style="bold blue")
    panel = Panel(header_text, border_style="blue")
    console.print(panel)


def show_success(message):
    console.print(f"[green]{message}[/green]")


def show_error(message):
    console.print(f"[red]{message}[/red]")


def show_info(message):
    console.print(f"[yellow]{message}[/yellow]")


def get_user_input(prompt):
    return console.input(f"[cyan]{prompt}[/cyan]: ")


def normalize_site_url(raw: str) -> str:
    value = raw.strip().rstrip("/")
    if not value:
        return ""
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return f"https://{value}"


def show_config_table(config):
    if not config:
        show_error("CHƯA CẤU HÌNH")
        console.print("Token và ChatID chưa được cấu hình.")
        console.print("Vui lòng chọn option 1 để cập nhật config.")
        return

    table = Table(
        title="CONFIG HIỆN TẠI", show_header=True, header_style="bold magenta"
    )
    table.add_column("Key", style="cyan", no_wrap=True)
    table.add_column("Value", style="green")

    for key, value in config.items():
        table.add_row(key, value)

    console.print(table)


def update_config():
    clear_screen()
    show_header("CONFIG UPDATER | tele:@ovftank")

    site_url = normalize_site_url(get_user_input("Site URL (vd: abc.vercel.app)"))
    if not site_url:
        show_error("Site URL không được để trống")
        input(CONTINUE_MESSAGE)
        return

    token = get_user_input("TOKEN")
    chat_id = get_user_input("CHAT_ID")

    url = f"{site_url}/api/config"

    payload = {}
    if token:
        payload["TOKEN"] = token
    if chat_id:
        payload["CHAT_ID"] = chat_id

    if not payload:
        show_error("Không có dữ liệu để cập nhật")
        input(CONTINUE_MESSAGE)
        return

    try:
        response = requests.post(url, json=payload, timeout=10)

        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                show_success("Config cập nhật thành công!")
                webhook = data.get("webhook") or {}
                if webhook.get("ok"):
                    show_success(f"Webhook OK: {webhook.get('webhookUrl', '')}")
                else:
                    show_error(f"Webhook lỗi: {webhook.get('error', 'unknown')}")
                if data.get("approval_store_ready") is False:
                    show_error(data.get("approval_store_error") or "Redis chưa sẵn sàng trên Vercel")
            else:
                show_error(data.get("error") or "Server trả về success=false")
        else:
            show_error(f"Lỗi HTTP: {response.status_code}")
            console.print(f"Response: {response.text}")

    except requests.exceptions.ConnectionError:
        show_error(f"Không kết nối được đến {url}")
        console.print("Kiểm tra lại Site URL và đảm bảo site Vercel đang online")
    except requests.exceptions.Timeout:
        show_error("Request timeout")
    except Exception as e:
        show_error(f"Lỗi: {e}")

    input(CONTINUE_MESSAGE)


def get_config():
    clear_screen()
    show_header("CONFIG READER | tele:@ovftank")

    site_url = normalize_site_url(get_user_input("Site URL (vd: abc.vercel.app)"))
    if not site_url:
        show_error("Site URL không được để trống")
        input(CONTINUE_MESSAGE)
        return

    url = f"{site_url}/api/config"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            show_error(f"Lỗi HTTP: {response.status_code}")
            console.print(f"Response: {response.text}")
            input(CONTINUE_MESSAGE)
            return

        data = response.json()
        if not data.get("success"):
            show_error("Server trả về success=false")
            input(CONTINUE_MESSAGE)
            return

        config = data.get("config", {})
        show_config_table(config)

        if data.get("approval_store_ready") is False:
            show_error(data.get("approval_store_error") or "Redis chưa sẵn sàng trên Vercel")

        webhook = data.get("webhook")
        if webhook:
            show_info(f"Webhook hiện tại: {webhook.get('result', {}).get('url', 'N/A')}")

    except requests.exceptions.ConnectionError:
        show_error(f"Không kết nối được đến {url}")
        console.print("Kiểm tra lại Site URL và đảm bảo site Vercel đang online")
    except requests.exceptions.Timeout:
        show_error("Request timeout")
    except Exception as e:
        show_error(f"Lỗi: {e}")

    input(CONTINUE_MESSAGE)


def display_menu_options(options, current_selection):
    for i, option in enumerate(options):
        if i == current_selection:
            console.print(f"[blue]▶[/blue] [bold white]{option}[/bold white]")
        else:
            console.print(f"  {option}")


def handle_arrow_key(key, current_selection, options_count):
    if key == b"H":
        return (current_selection - 1) % options_count
    elif key == b"P":
        return (current_selection + 1) % options_count
    return current_selection


def wait_for_key_press():
    while True:
        if msvcrt.kbhit():
            return msvcrt.getch()


def show_menu_with_arrows():
    options = ["Cập nhật config", "Xem config hiện tại", "Thoát"]

    current_selection = 0

    while True:
        clear_screen()
        show_header("CONFIG MANAGEMENT TOOL | tele:@ovftank")

        display_menu_options(options, current_selection)

        key = wait_for_key_press()

        if key == b"\xe0":
            arrow_key = msvcrt.getch()
            current_selection = handle_arrow_key(
                arrow_key, current_selection, len(options)
            )
        elif key == b"\r":
            return current_selection


def main():
    while True:
        selection = show_menu_with_arrows()

        if selection == 0:
            update_config()
        elif selection == 1:
            get_config()
        elif selection == 2:
            clear_screen()
            show_header("CẢM ƠN ĐÃ SỬ DỤNG TOOL! | tele:@ovftank")
            break


if __name__ == "__main__":
    main()
