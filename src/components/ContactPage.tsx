import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  Headphones,
  CreditCard,
  Scale,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  HelpCircle
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Contact form validation schema
  const contactSchema = z.object({
    name: z.string().min(1, t('contact.form.required')),
    email: z.string().email(t('contact.form.invalidEmail')),
    phone: z.string().min(10, t('contact.form.invalidPhone')),
    subject: z.string().min(1, t('contact.form.required')),
    message: z.string().min(10, t('contact.form.messageMinLength'))
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Contact form data:', data);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info.address.title'),
      value: t('contact.info.address.value'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      value: t('contact.info.phone.value'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      value: t('contact.info.email.value'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: t('contact.info.hours.title'),
      value: t('contact.info.hours.value'),
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const departments = [
    {
      icon: Headphones,
      title: t('contact.support.title'),
      description: t('contact.support.description'),
      email: t('contact.support.email'),
      phone: t('contact.support.phone'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: t('contact.sales.title'),
      description: t('contact.sales.description'),
      email: t('contact.sales.email'),
      phone: t('contact.sales.phone'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Scale,
      title: t('contact.legal.title'),
      description: t('contact.legal.description'),
      email: t('contact.legal.email'),
      color: 'from-red-500 to-red-600'
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, name: 'Twitter', url: '#', color: 'hover:text-sky-500' },
    { icon: Instagram, name: 'Instagram', url: '#', color: 'hover:text-pink-600' },
    { icon: Youtube, name: 'YouTube', url: '#', color: 'hover:text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 via-blue-600 to-emerald-600 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-display">
              {t('contact.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 font-display">
                {t('contact.form.title')}
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-800">{t('contact.form.success')}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{t('contact.form.error')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder={t('contact.form.name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder={t('contact.form.email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      dir={i18n.language === 'ar' ? 'ltr' : 'ltr'}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        i18n.language === 'ar' ? 'text-right' : 'text-left'
                      }`}
                      placeholder={t('contact.form.phone')}
                    />
                    {errors.phone && (
                      <p className={`mt-1 text-red-600 text-sm ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder={t('contact.form.subject')}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-red-600 text-sm">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={t('contact.form.message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-red-600 text-sm">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-primary-700 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display">
                  {t('contact.info.title')}
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{info.title}</h4>
                        <p className="text-slate-600" dir={info.icon === Phone ? 'ltr' : undefined}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{t('contact.faq.title')}</h3>
                </div>
                <p className="text-white/90 mb-6">{t('contact.faq.description')}</p>
                <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-medium hover:bg-amber-50 transition-colors duration-200">
                  {t('contact.faq.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 font-display">
              {t('contact.departments.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('contact.departments.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <dept.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{dept.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{dept.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <a href={`mailto:${dept.email}`} className="text-primary-600 hover:text-primary-700 transition-colors">
                      {dept.email}
                    </a>
                  </div>
                  {dept.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <a href={`tel:${dept.phone}`} className="text-primary-600 hover:text-primary-700 transition-colors" dir="ltr">
                        {dept.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 font-display">
                {t('contact.social.title')}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('contact.social.description')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary-300 transition-all duration-200 ${social.color} group`}
                  >
                    <social.icon className="w-6 h-6 text-slate-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-slate-700">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 font-display">
                {t('contact.map.title')}
              </h3>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">{t('contact.map.placeholder')}</p>
                  <p className="text-slate-500 text-sm">{t('contact.map.location')}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-primary-800">{t('contact.map.detailedAddress')}</p>
                    <p className="text-primary-600 text-sm">{t('contact.map.address')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
              {t('contact.quickContact.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t('contact.quickContact.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+966111234567"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                {t('contact.quickContact.callButton')}
              </a>
              <a
                href="mailto:support@rezge.com"
                className="bg-white/10 backdrop-blur-lg text-white border border-white/20 px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/20 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                {t('contact.quickContact.emailButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
