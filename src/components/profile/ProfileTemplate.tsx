import type { AcademicProfile } from '@/types/profile';
import MinimalTemplate from './templates/MinimalTemplate';
import ResearchFocusedTemplate from './templates/ResearchFocusedTemplate';
import TeachingOrientedTemplate from './templates/TeachingOrientedTemplate';
import IndustryHybridTemplate from './templates/IndustryHybridTemplate';

interface ProfileTemplateProps {
  profile: AcademicProfile;
}

export default function ProfileTemplate({ profile }: ProfileTemplateProps) {
  switch (profile.template) {
    case 'minimal':
      return <MinimalTemplate profile={profile} />;
    case 'research-focused':
      return <ResearchFocusedTemplate profile={profile} />;
    case 'teaching-oriented':
      return <TeachingOrientedTemplate profile={profile} />;
    case 'industry-hybrid':
      return <IndustryHybridTemplate profile={profile} />;
    default:
      return <MinimalTemplate profile={profile} />;
  }
}
