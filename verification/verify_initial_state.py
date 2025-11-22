from playwright.sync_api import Page, expect, sync_playwright

def test_app_initial_state(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:5173")

    # 2. Act: Wait for the login button to be visible.
    # The initial state might be "isLoading", so we should wait.
    # The "Bienvenido" text appears only when !isLoading and !isAuthenticated.

    # Capture a screenshot if it fails
    try:
        expect(page.get_by_text("Bienvenido")).to_be_visible(timeout=10000)
        expect(page.get_by_role("button", name="Log In")).to_be_visible()
    except Exception as e:
        page.screenshot(path="verification/error_state.png")
        print("Error encountered, screenshot saved to verification/error_state.png")
        # Check if we are stuck on loading or error
        if page.get_by_role("progressbar").is_visible():
            print("Stuck on loading spinner")
        elif page.get_by_text("Error de autenticación").is_visible():
             print("Authentication error visible")
        else:
             print("Unknown state")
        raise e

    # 3. Screenshot: Capture the initial state.
    page.screenshot(path="verification/initial_state.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_app_initial_state(page)
        finally:
            browser.close()
