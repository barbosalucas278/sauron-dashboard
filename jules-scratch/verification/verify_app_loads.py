from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the development server URL
            page.goto("http://localhost:5173")

            # Wait for the login button to be visible to ensure the page has loaded
            login_button = page.get_by_role("button", name="Log In")
            expect(login_button).to_be_visible()

            # Take a screenshot for visual confirmation
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot saved to jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()