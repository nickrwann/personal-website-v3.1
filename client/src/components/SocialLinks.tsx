import { SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';

interface SocialLink {
  platform: 'github' | 'linkedin' | 'instagram';
  url: string;
  label: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap = {
  github: SiGithub,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <nav aria-label="Social media links" className="flex items-center gap-3">
      {links.map(({ platform, url, label }) => {
        const Icon = iconMap[platform];
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-testid={`link-social-${platform}`}
            className="text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 p-2 rounded-md"
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}
