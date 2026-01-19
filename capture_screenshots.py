from playwright.sync_api import sync_playwright
import os

os.makedirs('/tmp/kait-screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})

    pages_to_capture = [
        ('/', 'homepage'),
        ('/about', 'about'),
        ('/work', 'work'),
        ('/songs', 'songs'),
        ('/media', 'media'),
        ('/contact', 'contact'),
    ]

    for path, name in pages_to_capture:
        print(f"Capturing {name}...")
        page.goto(f'http://localhost:4321{path}')
        page.wait_for_load_state('networkidle')
        page.screenshot(path=f'/tmp/kait-screenshots/{name}.png', full_page=True)
        print(f"  Saved /tmp/kait-screenshots/{name}.png")

    browser.close()
    print("Done!")
