# Page snapshot

```yaml
- generic [ref=e6]:
  - heading "Sign In" [level=1] [ref=e8]
  - generic [ref=e10]:
    - generic [ref=e11]:
      - paragraph [ref=e13]: Email *
      - generic [ref=e16]:
        - textbox "user@company.com" [ref=e17]
        - group
    - generic [ref=e18]:
      - paragraph [ref=e20]: Password *
      - generic [ref=e23]:
        - textbox "********" [ref=e24]
        - group
      - paragraph [ref=e25]:
        - link "Forgot password?" [ref=e26] [cursor=pointer]:
          - /url: /forgot-password
    - button "Login" [ref=e27] [cursor=pointer]: Login
```