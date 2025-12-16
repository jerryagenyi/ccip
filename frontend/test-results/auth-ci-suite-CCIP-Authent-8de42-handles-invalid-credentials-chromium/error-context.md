# Page snapshot

```yaml
- generic [ref=e6]:
  - alert [ref=e7]:
    - img [ref=e9]
    - generic [ref=e11]: User Not Found
  - heading "Sign In" [level=1] [ref=e13]
  - generic [ref=e15]:
    - generic [ref=e16]:
      - paragraph [ref=e18]: Email *
      - generic [ref=e21]:
        - textbox "user@company.com" [ref=e22]: invalid@example.com
        - group
    - generic [ref=e23]:
      - paragraph [ref=e25]: Password *
      - generic [ref=e28]:
        - textbox "********" [ref=e29]: wrongpassword
        - group
      - paragraph [ref=e30]:
        - link "Forgot password?" [ref=e31] [cursor=pointer]:
          - /url: /forgot-password
    - button "Login" [ref=e32] [cursor=pointer]: Login
```