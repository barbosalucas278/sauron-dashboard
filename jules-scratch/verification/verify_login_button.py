from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local development server
        page.goto("http://localhost:5174/")

        # Wait for the "Log In" button to be visible
        login_button = page.get_by_role("button", name="Log In")
        expect(login_button).to_be_visible()

        # Take a screenshot to verify the result
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()