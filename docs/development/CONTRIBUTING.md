# Contributing to CCIP

Thank you for your interest in contributing to CCIP! This guide will help you get started.

## 🚀 Quick Start for Contributors

### For New Contributors
1. Read [Quick Start Guide](./QUICK_START.md) - Get CCIP running locally
2. Read [Docker Practices](./DOCKER_PRACTICES.md) - Understand our data management
3. Pick an issue from [GitHub Issues](https://github.com/your-org/ccip/issues)

### For Developers
1. Set up your development environment (see [Developer Setup](./DEVELOPER_SETUP.md))
2. Create a fork of the repository
3. Create a feature branch from `main`
4. Follow SpecKit-driven development process

## 🎯 How We Work

### SpecKit-Driven Development

CCIP follows **SpecKit methodology**:

1. **READ SPEC** → `specs/epic-XXX-feature-name/spec.md`
2. **READ PLAN** → `specs/epic-XXX-feature-name/plan.md`
3. **READ TASKS** → `specs/epic-XXX-feature-name/tasks.md`
4. **IMPLEMENT** → Following the task order
5. **DOCUMENT** → Update inline comments and specs
6. **TEST** → Ensure all tests pass

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Implement following SpecKit tasks
# (Refer to the relevant Epic spec)

# 3. Test your changes
docker-compose exec backend php artisan test
docker-compose exec frontend npm run test

# 4. Commit with conventional commits
git commit -m "feat(auth): add password reset functionality"

# 5. Push and create pull request
git push origin feature/your-feature-name
```

## 📝 Code Standards

### Backend (Laravel)

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;

/**
 * Activity Controller
 *
 * Manages risk communication activities for public health officials.
 * Ensures proper validation and audit trails for all activity data.
 */
class ActivityController extends Controller
{
    /**
     * Store a new risk communication activity.
     *
     * @param StoreActivityRequest $request Validated activity data
     * @return JsonResponse Created activity with ID
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $activity = Activity::create([
            'title' => $request->title,
            'description' => $request->description,
            'organisation_id' => auth()->user()->organisation_id,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Activity created successfully',
            'data' => $activity
        ], 201);
    }
}
```

### Frontend (Vue 3 + Composition API)

```vue
<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Create Activity</div>

    <q-form @submit="createActivity" class="q-gutter-md">
      <q-input
        v-model="form.title"
        label="Activity Title"
        outlined
        :rules="[val => !!val || 'Title is required']"
      />

      <q-editor
        v-model="form.description"
        label="Description"
        min-height="10rem"
      />

      <q-btn
        type="submit"
        color="primary"
        label="Create Activity"
        :loading="loading"
      />
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useActivityStore } from 'src/stores/activity'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const activityStore = useActivityStore()
const router = useRouter()

// Reactive form data for activity creation
const form = reactive({
  title: '',
  description: ''
})

const loading = ref(false)

/**
 * Creates a new activity after validation
 * Shows success notification and redirects to activity list
 */
const createActivity = async () => {
  loading.value = true

  try {
    await activityStore.createActivity(form)

    $q.notify({
      type: 'positive',
      message: 'Activity created successfully'
    })

    router.push('/activities')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create activity'
    })
  } finally {
    loading.value = false
  }
}
</script>
```

## 🧪 Testing Requirements

### Backend Testing

```php
// tests/Feature/ActivityTest.php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_activity()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->post('/api/activities', [
            'title' => 'COVID-19 Vaccination Campaign',
            'description' => 'Community outreach for vaccine awareness'
        ]);

        $response->assertStatus(201)
                ->assertJsonFragment([
                    'title' => 'COVID-19 Vaccination Campaign'
                ]);

        $this->assertDatabaseHas('activities', [
            'title' => 'COVID-19 Vaccination Campaign',
            'created_by' => $user->id
        ]);
    }
}
```

### Frontend Testing

```javascript
// tests/components/ActivityForm.spec.js
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ActivityForm from 'src/components/ActivityForm.vue'

describe('ActivityForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('validates required fields', async () => {
    const wrapper = mount(ActivityForm)

    await wrapper.find('[data-testid="submit-btn"]').trigger('click')

    expect(wrapper.find('[data-testid="title-error"]').exists()).toBe(true)
  })

  it('emits create-activity event with form data', async () => {
    const wrapper = mount(ActivityForm)

    await wrapper.find('[data-testid="title-input"]').setValue('Test Activity')
    await wrapper.find('[data-testid="description-input"]').setValue('Test Description')
    await wrapper.find('[data-testid="submit-btn"]').trigger('click')

    expect(wrapper.emitted('create-activity')).toBeTruthy()
    expect(wrapper.emitted('create-activity')[0][0]).toMatchObject({
      title: 'Test Activity',
      description: 'Test Description'
    })
  })
})
```

## 📋 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add password reset functionality

- Add password reset email template
- Implement token-based reset flow
- Add rate limiting for reset requests

Closes #123
```

```
fix(dashboard): resolve activity count display

- Fix SQL query in dashboard controller
- Add proper error handling for missing data
- Update test cases
```

## 🔄 Pull Request Process

### Before Creating PR
1. **Run all tests**: `docker-compose exec backend php artisan test`
2. **Code formatting**: Ensure code follows project standards
3. **Update documentation**: If applicable
4. **Test on different browsers**: For frontend changes

### PR Template
```markdown
## Description
Brief description of changes and why they're needed.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Testing
- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (for frontend changes)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code
- [ ] Documentation updated
- [ ] Specs updated if scope changed

## Related Issue
Closes #(issue number)
```

## 🏷️ Issue Labels

### Priority
- `priority/critical` - Must fix immediately
- `priority/high` - Should fix in current sprint
- `priority/medium` - Normal priority
- `priority/low` - Nice to have

### Type
- `type/bug` - Bug report
- `type/feature` - Feature request
- `type/enhancement` - Improvement
- `type/docs` - Documentation
- `type/question` - Question

### Status
- `status/in-progress` - Currently being worked on
- `status/review-needed` - Waiting for review
- `status/approved` - Approved for implementation

## 🚫 What Not to Commit

- **Environment files**: `.env`, `.env.local`
- **Dependencies**: `node_modules/`, `vendor/`
- **Runtime data**: Database files, logs, cache
- **Build artifacts**: `dist/`, build outputs
- **Personal notes**: TODO comments without context

## 🤝 Getting Help

### For Technical Questions
1. Check existing [documentation](./README.md)
2. Search [GitHub Issues](https://github.com/your-org/ccip/issues)
3. Create a new issue with the `question` label

### For Process Questions
1. Check this contributing guide
2. Ask in [GitHub Discussions](https://github.com/your-org/ccip/discussions)
3. Contact maintainers directly

## 🌟 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual project summary

## 📜 Code of Conduct

CCIP follows the [Contributor Covenant](https://www.contributor-covenant.org/):

- Be inclusive and respectful
- Focus on constructive feedback
- Help others learn and grow
- Report unacceptable behavior to maintainers

---

Thank you for contributing to CCIP! Your work helps public health officials save lives through better risk communication. 🙏