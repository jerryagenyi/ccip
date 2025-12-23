<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Predictive Intelligence for Crisis Communication
        </h1>
        <p class="hero-subtitle">
          Move from reactive to predictive communication. With CCIP, you gain foresight into risks and a panoramic view of your crisis outreach, ensuring culturally‑intelligent communication that protects communities.
        </p>
        <div class="row q-gutter-md justify-center q-mt-lg">
          <q-btn
            v-if="!isAuthenticated"
            color="white"
            text-color="primary"
            size="lg"
            label="Get Started"
            icon="rocket_launch"
            @click="$router.push('/auth/register')"
          />
          <q-btn
            v-if="!isAuthenticated"
            color="white"
            text-color="primary"
            size="lg"
            outline
            label="Sign In"
            icon="login"
            @click="$router.push('/auth/login')"
          />
          <q-btn
            v-else
            color="white"
            text-color="primary"
            size="lg"
            label="Go to Dashboard"
            icon="dashboard"
            @click="$router.push('/dashboard')"
          />
        </div>
      </div>
    </section>

    <!-- Feature Showcase Section -->
    <section id="features" class="features-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">A New Level of Coordination</h2>
          <p class="section-subtitle">
            From national strategy to community outreach, CCIP unifies every layer of your organisation.
          </p>
        </div>
        <div class="row q-col-gutter-lg">
          <div
            v-for="feature in features"
            :key="feature.name"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="feature-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon :name="feature.icon" size="48px" color="primary" class="q-mb-md" />
                <div class="text-h6 text-weight-bold q-mb-sm">{{ feature.name }}</div>
                <div class="text-body2 text-grey-7">
                  {{ feature.description }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">
            Find answers to common questions about CCIP.
          </p>
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-10 col-lg-8">
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                v-for="(faq, index) in faqs"
                :key="index"
                :label="faq.question"
                :default-opened="index === 0"
                header-class="text-h6 text-weight-medium"
                expand-separator
              >
                <q-card>
                  <q-card-section class="text-body1 text-grey-7">
                    {{ faq.answer }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">Contact Us</h2>
          <p class="section-subtitle">
            Have questions or want to request a demo? We'd love to hear from you.
          </p>
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-10 col-lg-8">
            <q-card flat bordered>
              <q-card-section class="q-pa-lg">
                <q-form @submit="handleContactSubmit" class="q-gutter-md">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="contactForm.name"
                        label="Full Name"
                        outlined
                        :rules="[val => !!val || 'Name is required']"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="contactForm.email"
                        label="Email Address"
                        type="email"
                        outlined
                        :rules="[
                          val => !!val || 'Email is required',
                          val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
                        ]"
                      />
                    </div>
                  </div>
                  <q-input
                    v-model="contactForm.subject"
                    label="Subject"
                    outlined
                    :rules="[val => !!val || 'Subject is required']"
                    hint="e.g., Demo Request"
                  />
                  <q-input
                    v-model="contactForm.message"
                    label="Message"
                    type="textarea"
                    outlined
                    rows="5"
                    :rules="[val => !!val || 'Message is required']"
                  />
                  <div class="text-center">
                    <q-btn
                      type="submit"
                      color="primary"
                      size="lg"
                      label="Send Message"
                      icon="mail"
                      :loading="contactSubmitting"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="!isAuthenticated" class="cta-section q-pa-xl text-center">
      <div class="container">
        <h3 class="text-h5 text-weight-bold q-mb-md">
          Ready to get started?
        </h3>
        <p class="text-body1 text-grey-7 q-mb-lg">
          Join organisations worldwide using CCIP to improve their risk communication activities
        </p>
        <q-btn
          color="primary"
          size="lg"
          label="Create Account"
          icon="person_add"
          @click="$router.push('/auth/register')"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const features = [
  {
    name: 'Predictive Semiotic Analysis',
    description: 'Assess communication risk before deployment to avoid cultural missteps.',
    icon: 'psychology',
  },
  {
    name: 'Role-Based Dashboards',
    description: 'Tailored views for Federal, State, and LGA levels.',
    icon: 'dashboard',
  },
  {
    name: 'Campaign Management',
    description: 'Plan, track, and manage all public health campaigns.',
    icon: 'assignment',
  },
  {
    name: 'Hierarchical Structure',
    description: 'Link organisations from national to community levels.',
    icon: 'account_tree',
  },
  {
    name: 'Team Directory',
    description: 'Manage user roles, permissions, and invitations.',
    icon: 'people',
  },
  {
    name: 'AI-Powered Reporting',
    description: 'Generate insightful reports on trends and outcomes.',
    icon: 'insights',
  },
];

const faqs = [
  {
    question: 'What is CCIP?',
    answer: 'CCIP (Crisis Communication Intelligence Platform) is a comprehensive platform designed to coordinate, track, and optimize public health risk communication activities globally. It helps organizations move from reactive to predictive communication strategies.',
  },
  {
    question: 'Who can use CCIP?',
    answer: 'CCIP is designed for public health organizations, government agencies, NGOs, and any organization involved in crisis communication and public health risk management. It supports multi-tier organizational structures from national to community levels.',
  },
  {
    question: 'How does semiotic analysis work?',
    answer: 'Our AI-powered semiotic analysis evaluates communication messages for cultural appropriateness and effectiveness before deployment. It identifies potential cultural missteps, provides recommendations, and helps ensure your messages resonate with target audiences.',
  },
  {
    question: 'Is CCIP available globally?',
    answer: 'Yes, CCIP is designed as a global platform with configurable administrative hierarchies. It supports multiple languages and can be adapted to different regional structures and requirements.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply create an account using the "Get Started" button. You can register your organization and start managing risk communication activities immediately. For enterprise needs or custom requirements, please contact us through the contact form.',
  },
];

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const contactSubmitting = ref(false);

const handleContactSubmit = async () => {
  contactSubmitting.value = true;
  
  try {
    const response = await api.post('/contact', contactForm.value);
    
    $q.notify({
      type: 'positive',
      message: response.data?.message || 'Thank you for your message! We\'ll get back to you soon.',
      position: 'top',
    });
    
    // Reset form
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  } catch (error: any) {
    // Error is already handled by axios interceptor, but we can add additional handling here if needed
    if (!error.response) {
      $q.notify({
        type: 'negative',
        message: 'Failed to send message. Please check your connection and try again.',
        position: 'top',
      });
    }
  } finally {
    contactSubmitting.value = false;
  }
};

onMounted(() => {
  // If authenticated, redirect to dashboard after a moment
  if (isAuthenticated.value) {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  }
});
</script>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%);
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
}

.hero-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

// Section Styles
.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.section-subtitle {
  font-size: 1.125rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

// Features Section
.features-section {
  background-color: #fafafa;
}

.feature-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

// FAQ Section
.faq-section {
  background-color: #ffffff;
}

// Contact Section
.contact-section {
  background-color: #fafafa;
}

// CTA Section
.cta-section {
  background-color: #ffffff;
}
</style>

