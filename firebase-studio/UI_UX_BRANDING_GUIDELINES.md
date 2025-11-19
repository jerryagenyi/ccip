# UI/UX Branding Guidelines

## Footer/Copyright Display

### Format
The footer displays copyright information with the following format:

```
© [Current Year] [Organisation Name] • Powered by RCAP v[Version]
```

### Examples

**With Organisation:**
```
© 2025 Federal Ministry of Health • Powered by RCAP v1.0.0
© 2025 State Health Department • Powered by RCAP v1.0.0
© 2025 Local Health Office • Powered by RCAP v1.0.0
© 2025 National CSO Network • Powered by RCAP v1.0.0
```

**Without Organisation (fallback):**
```
© 2025 Powered by RCAP v1.0.0
```

### Design Rationale

1. **Copyright Ownership**: Organisation holds copyright for their content and instance
2. **Platform Attribution**: "Powered by RCAP" gives proper credit to the technology provider
3. **Professional Partnership**: Clear distinction between content owner and technology provider
4. **Version Number**: Helps with support and debugging, shows platform maturity
5. **Dynamic Year**: Automatically updates to current year
6. **Flexible**: Works whether user belongs to an organisation or not

### Implementation

The footer component (`AppFooter.vue`) automatically:
- Gets the current year dynamically
- Retrieves organisation name from the authenticated user's data
- Falls back gracefully if no organisation is set
- Uses consistent styling across the application

### Usage

**Vue/Quasar (Main Application):**

Include the footer component in layouts where needed:

```vue
<template>
  <q-layout>
    <!-- Main content -->
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <!-- Footer -->
    <q-footer elevated class="bg-grey-1">
      <AppFooter />
    </q-footer>
  </q-layout>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
</script>
```

**React (Figma Make/Design System):**

```tsx
import { AppFooter } from '@/components/AppFooter';

// With organisation name (when user is logged in)
<AppFooter 
  organisationName={user?.organisation?.name} 
  version="1.0.0"
/>

// Without organisation name (login screen, etc.)
<AppFooter version="1.0.0" />
```

### Branding Strategy

**Why "Powered by RCAP" Format?**

1. **Legal Correctness**: Organisation owns copyright to their content, RCAP provides technology
2. **Professional Partnership**: "Powered by" is a standard industry pattern for technology attribution
3. **Organisation Prominence**: Their name comes first, which they appreciate for branding
4. **Platform Recognition**: RCAP gets proper credit while respecting ownership hierarchy
5. **Support & Debugging**: Version number helps support teams identify issues

**Alternative Approaches Considered:**

- ❌ **© 2025 Federal Ministry of Health • RCAP v1.0.0**: Implies RCAP owns the content
- ❌ **© 2025 RCAP Platform • Federal Ministry of Health**: Legal confusion over ownership
- ✅ **© 2025 Federal Ministry of Health • Powered by RCAP v1.0.0**: Clear ownership and proper attribution

### Styling

- Small, unobtrusive text (0.75rem)
- Muted colour (#6b7280 / grey-500)
- Centred alignment
- Subtle border-top for separation
- Light background (#fafafa) for contrast

### Future Considerations

- Version could be pulled from `package.json` or environment variable
- Could add organisation logo next to name
- Could make organisation name clickable to show organisation details
- Could add "Powered by RCAP" variant for white-label deployments

