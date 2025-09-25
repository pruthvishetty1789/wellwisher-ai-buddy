import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिंदी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
} as const;

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <Card className="bg-gradient-wellness shadow-wellness border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-white" />
            <h3 className="font-medium text-white">{t('language.select')}</h3>
          </div>
        </div>

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <span className="flex items-center gap-2">
                {languages[language].nativeName}
                {language !== 'en' && (
                  <span className="text-white/70">({languages[language].name})</span>
                )}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {(Object.keys(languages) as Language[]).map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`cursor-pointer ${language === lang ? 'bg-accent' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{languages[lang].nativeName}</span>
                  {lang !== 'en' && (
                    <span className="text-sm text-muted-foreground">
                      {languages[lang].name}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="text-xs text-white/80 mt-2 text-center">
          {t('language.current')}: {languages[language].nativeName}
        </p>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;