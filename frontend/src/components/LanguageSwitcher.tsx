import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS } from '../i18n';

interface LanguageSwitcherProps {
    className?: string;
}

function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { t, i18n } = useTranslation();
    const currentLanguage = useMemo(() => (
        i18n.resolvedLanguage?.split('-')[0] ?? i18n.language
    ), [i18n.language, i18n.resolvedLanguage]);

    return (
        <label
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                color: '#f8f9fa'
            }}
        >
            <span>{t('language.label')}</span>
            <select
                value={currentLanguage}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
                style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    background: 'rgba(0,0,0,0.4)',
                    color: '#f8f9fa'
                }}
            >
                {LANGUAGE_OPTIONS.map(({ value, labelKey }) => (
                    <option key={value} value={value}>
                        {t(labelKey)}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default LanguageSwitcher;
