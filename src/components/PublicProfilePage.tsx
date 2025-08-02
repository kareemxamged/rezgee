import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, messageService } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { translateCountryName, translateLocation } from '../utils/locationTranslation';
import CountryFlagImage from './CountryFlagImage';
import {
  User,
  MapPin,
  Calendar,
  Book,
  GraduationCap,
  Heart,
  DollarSign,
  Globe,
  MessageSquare,
  ArrowLeft,
  Shield,
  Users,
  Home,
  Star
} from 'lucide-react';

interface PublicUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: 'male' | 'female';
  city?: string;
  marital_status?: string;
  education?: string;
  profession?: string;
  religious_commitment?: string;
  bio?: string;
  looking_for?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
  marriage_type?: string;
  children_count?: number;
  residence_location?: string;
  nationality?: string;
  weight?: number;
  height?: number;
  skin_color?: string;
  body_type?: string;
  religiosity_level?: string;
  prayer_commitment?: string;
  smoking?: string;
  beard?: string;
  hijab?: string;
  education_level?: string;
  financial_status?: string;
  work_field?: string;
  job_title?: string;
  monthly_income?: string;
  health_status?: string;
}

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Get current language direction
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await userService.getPublicUserProfile(id);
      
      if (error) {
        setError(t('publicProfile.error.notFound'));
        return;
      }

      if (!data) {
        setError(t('publicProfile.error.doesNotExist'));
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(t('publicProfile.error.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !profile) return;

    try {
      setSendingMessage(true);
      
      // Create or get conversation
      const { error: convError } = await messageService.createConversation(
        currentUser.id,
        profile.id
      );

      if (convError) {
        console.error('Error creating conversation:', convError);
        return;
      }

      // Navigate to messages page
      navigate('/messages');
    } catch (err) {
      console.error('Error starting conversation:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Helper functions for displaying data
  const getMaritalStatusText = (status?: string) => {
    if (!status) return t('publicProfile.values.notSpecified');
    return t(`publicProfile.values.maritalStatus.${status}`, { defaultValue: status });
  };

  const getMarriageTypeText = (type?: string) => {
    if (!type) return '';
    return t(`publicProfile.values.marriageType.${type}`, { defaultValue: '' });
  };

  const getReligiousCommitmentText = (level?: string) => {
    if (!level) return t('publicProfile.values.notSpecified');
    return t(`publicProfile.values.religiousCommitment.${level}`, { defaultValue: level });
  };

  const getReligiosityLevelText = (level?: string) => {
    if (!level) return '';
    return t(`publicProfile.values.religiosityLevel.${level}`, { defaultValue: '' });
  };

  const getPrayerCommitmentText = (commitment?: string) => {
    if (!commitment) return '';
    return t(`publicProfile.values.prayerCommitment.${commitment}`, { defaultValue: '' });
  };

  const getEducationLevelText = (level?: string) => {
    if (!level) return '';
    return t(`publicProfile.values.educationLevel.${level}`, { defaultValue: '' });
  };

  const getFinancialStatusText = (status?: string) => {
    if (!status) return '';
    return t(`publicProfile.values.financialStatus.${status}`, { defaultValue: '' });
  };

  const getMonthlyIncomeText = (income?: string) => {
    if (!income) return '';
    return t(`publicProfile.values.monthlyIncome.${income}`, { defaultValue: '' });
  };

  const getHealthStatusText = (status?: string) => {
    if (!status) return '';
    return t(`publicProfile.values.healthStatus.${status}`, { defaultValue: '' });
  };

  const getHijabText = (hijab?: string) => {
    if (!hijab) return '';
    return t(`publicProfile.values.hijab.${hijab}`, { defaultValue: '' });
  };

  // دوال ترجمة الجنسية ومكان الإقامة
  const getNationalityText = (nationality?: string) => {
    if (!nationality) return t('publicProfile.values.notSpecified');
    return translateCountryName(nationality, i18n.language);
  };

  const getResidenceLocationText = (location?: string) => {
    if (!location) return t('publicProfile.values.notSpecified');
    return translateLocation(location, i18n.language);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('publicProfile.loading.message')}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('publicProfile.error.unavailable')}</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('publicProfile.error.backButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            {t('publicProfile.header.backButton')}
          </button>

          {currentUser && currentUser.id !== profile.id && (
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage}
              className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingMessage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('publicProfile.header.sending')}
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  {t('publicProfile.header.sendMessage')}
                </>
              )}
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                  {/* علم الدولة */}
                  <CountryFlagImage
                    nationality={profile.nationality}
                    size="md"
                    position="top-right"
                    showTooltip={true}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-800">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    {profile.verified && (
                      <Shield className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-slate-600 mb-4">
                    {profile.age && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{profile.age} {t('publicProfile.values.yearsOld')}</span>
                      </div>
                    )}
                    {profile.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.city}</span>
                      </div>
                    )}
                    {profile.gender && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{profile.gender === 'male' ? t('publicProfile.values.male') : t('publicProfile.values.female')}</span>
                      </div>
                    )}
                  </div>
                  {profile.created_at && (
                    <p className="text-sm text-slate-500">
                      {t('publicProfile.values.memberSince')} {new Date(profile.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        calendar: 'gregory'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary-600" />
                    {t('publicProfile.sections.bio')}
                  </h3>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Looking For Section */}
              {profile.looking_for && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary-600" />
                    {t('publicProfile.sections.lookingFor')}
                  </h3>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {profile.looking_for}
                  </p>
                </div>
              )}

              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  {t('publicProfile.sections.basicInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.marital_status && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{t('publicProfile.fields.maritalStatus')}</span>
                      </div>
                      <p className="text-slate-600">{getMaritalStatusText(profile.marital_status)}</p>
                    </div>
                  )}

                  {profile.marriage_type && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{t('publicProfile.fields.marriageType')}</span>
                      </div>
                      <p className="text-slate-600">{getMarriageTypeText(profile.marriage_type)}</p>
                    </div>
                  )}

                  {profile.children_count !== undefined && profile.children_count !== null && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{t('publicProfile.fields.childrenCount')}</span>
                      </div>
                      <p className="text-slate-600">{profile.children_count}</p>
                    </div>
                  )}

                  {profile.nationality && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{t('publicProfile.fields.nationality')}</span>
                      </div>
                      <p className="text-slate-600">{getNationalityText(profile.nationality)}</p>
                    </div>
                  )}

                  {profile.residence_location && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{t('publicProfile.fields.residenceLocation')}</span>
                      </div>
                      <p className="text-slate-600">{getResidenceLocationText(profile.residence_location)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Religious Information */}
            {(profile.religious_commitment || profile.religiosity_level || profile.prayer_commitment || profile.smoking || profile.beard || profile.hijab) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-600" />
                  {t('publicProfile.sections.religiousInfo')}
                </h3>
                <div className="space-y-4">
                  {profile.religious_commitment && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.commitmentLevel')}</span>
                      <p className="text-slate-600">{getReligiousCommitmentText(profile.religious_commitment)}</p>
                    </div>
                  )}

                  {profile.religiosity_level && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.religiosityLevel')}</span>
                      <p className="text-slate-600">{getReligiosityLevelText(profile.religiosity_level)}</p>
                    </div>
                  )}

                  {profile.prayer_commitment && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.prayerCommitment')}</span>
                      <p className="text-slate-600">{getPrayerCommitmentText(profile.prayer_commitment)}</p>
                    </div>
                  )}

                  {profile.smoking && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.smoking')}</span>
                      <p className="text-slate-600">{profile.smoking === 'yes' ? t('publicProfile.values.yes') : t('publicProfile.values.no')}</p>
                    </div>
                  )}

                  {profile.gender === 'male' && profile.beard && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.beard')}</span>
                      <p className="text-slate-600">{profile.beard === 'yes' ? t('publicProfile.values.yes') : t('publicProfile.values.no')}</p>
                    </div>
                  )}

                  {profile.gender === 'female' && profile.hijab && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.hijab')}</span>
                      <p className="text-slate-600">{getHijabText(profile.hijab)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education & Work */}
            {(profile.education || profile.profession || profile.education_level || profile.work_field || profile.job_title) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  {t('publicProfile.sections.educationWork')}
                </h3>
                <div className="space-y-4">
                  {profile.education && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.education')}</span>
                      <p className="text-slate-600">{profile.education}</p>
                    </div>
                  )}

                  {profile.education_level && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.educationLevel')}</span>
                      <p className="text-slate-600">{getEducationLevelText(profile.education_level)}</p>
                    </div>
                  )}

                  {profile.profession && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.profession')}</span>
                      <p className="text-slate-600">{profile.profession}</p>
                    </div>
                  )}

                  {profile.work_field && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.workField')}</span>
                      <p className="text-slate-600">{profile.work_field}</p>
                    </div>
                  )}

                  {profile.job_title && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.jobTitle')}</span>
                      <p className="text-slate-600">{profile.job_title}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial & Health */}
            {(profile.financial_status || profile.monthly_income || profile.health_status) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  {t('publicProfile.sections.financialHealth')}
                </h3>
                <div className="space-y-4">
                  {profile.financial_status && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.financialStatus')}</span>
                      <p className="text-slate-600">{getFinancialStatusText(profile.financial_status)}</p>
                    </div>
                  )}

                  {profile.monthly_income && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.monthlyIncome')}</span>
                      <p className="text-slate-600">{getMonthlyIncomeText(profile.monthly_income)}</p>
                    </div>
                  )}

                  {profile.health_status && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">{t('publicProfile.fields.healthStatus')}</span>
                      <p className="text-slate-600">{getHealthStatusText(profile.health_status)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
