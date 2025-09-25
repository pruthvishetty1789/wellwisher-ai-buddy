import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'ml' | 'mr' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & Headers
    'app.title': 'Well-Wisher AI',
    'app.subtitle': 'Your Mental Wellness Companion',
    'dashboard.title': 'Student Mental Wellness Dashboard',
    'dashboard.subtitle': 'Your personal space for emotional well-being and mental health support',
    
    // Chat Assistant
    'chat.title': 'AI Mental Wellness Assistant',
    'chat.powered': 'Powered by Gemini AI',
    'chat.placeholder': 'Share how you\'re feeling or ask for support...',
    'chat.quick_prompts': 'Quick prompts:',
    'chat.prompt.anxious': 'I\'m feeling anxious about exams',
    'chat.prompt.great': 'I had a great day today!',
    'chat.prompt.sleep': 'I\'m struggling with sleep',
    'chat.prompt.motivation': 'Need motivation to study',
    'chat.prompt.overwhelmed': 'Feeling overwhelmed lately',
    'chat.initial': 'Hello! I\'m your Well-Wisher AI assistant. I\'m here to provide emotional support and help with your mental wellness. How are you feeling today?',
    
    // Mood Tracker
    'mood.title': 'Mood Tracker',
    'mood.current': 'Current Mood',
    'mood.excellent': 'Excellent',
    'mood.good': 'Good',
    'mood.okay': 'Okay',
    'mood.bad': 'Bad',
    'mood.terrible': 'Terrible',
    'mood.energy': 'Energy Level',
    'mood.stress': 'Stress Level',
    'mood.note': 'Add a note about your day...',
    'mood.save': 'Save Mood',
    'mood.history': 'Mood History',
    'mood.insights': 'Weekly Insights',
    'mood.week_average': 'This week\'s average mood',
    'mood.improvement': '↑ 15% improvement from last week',
    
    // Wellness Reminders
    'reminders.title': 'Wellness Reminders',
    'reminders.subtitle': 'Healthy habits for your mental wellness',
    'reminders.hydration': 'Drink Water',
    'reminders.hydration_desc': 'Stay hydrated for better focus',
    'reminders.break': 'Take a Break',
    'reminders.break_desc': 'Step away from studies for 15 minutes',
    'reminders.breathing': 'Breathing Exercise',
    'reminders.breathing_desc': '5-minute mindfulness session',
    'reminders.stretch': 'Stretch & Move',
    'reminders.stretch_desc': 'Simple exercises to reduce tension',
    'reminders.gratitude': 'Gratitude Journal',
    'reminders.gratitude_desc': 'Write 3 things you\'re grateful for',
    'reminders.sleep': 'Sleep Preparation',
    'reminders.sleep_desc': 'Wind down routine before bed',
    'reminders.done': 'Done',
    
    // Emergency Alert
    'emergency.title': 'Emergency Support',
    'emergency.subtitle': 'Immediate help when you need it most',
    'emergency.panic': 'Panic Alert',
    'emergency.panic_desc': 'Instant SOS to your emergency contacts',
    'emergency.crisis': 'Crisis Helpline',
    'emergency.crisis_desc': '24/7 professional mental health support',
    'emergency.breathe': 'Breathing Exercise',
    'emergency.breathe_desc': 'Quick anxiety relief technique',
    'emergency.resources': 'Local Resources',
    'emergency.resources_desc': 'Find nearby counseling centers',
    'emergency.helpline': 'Call Crisis Helpline',
    'emergency.contacts': 'Alert Emergency Contacts',
    'emergency.breathing_guide': 'Start Breathing Exercise',
    'emergency.find_help': 'Find Local Help',
    
    // Language Selector
    'language.select': 'Select Language',
    'language.current': 'Current: English',
    
    // Common
    'common.send': 'Send',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.today': 'Today',
    'common.week': 'Week',
    'common.month': 'Month',
  },
  
  hi: {
    // Navigation & Headers
    'app.title': 'वेल-विशर AI',
    'app.subtitle': 'आपका मानसिक कल्याण साथी',
    'dashboard.title': 'छात्र मानसिक कल्याण डैशबोर्ड',
    'dashboard.subtitle': 'भावनात्मक कल्याण और मानसिक स्वास्थ्य सहायता के लिए आपका व्यक्तिगत स्थान',
    
    // Chat Assistant
    'chat.title': 'AI मानसिक कल्याण सहायक',
    'chat.powered': 'Gemini AI द्वारा संचालित',
    'chat.placeholder': 'बताएं कि आप कैसा महसूस कर रहे हैं या सहायता मांगें...',
    'chat.quick_prompts': 'त्वरित संकेत:',
    'chat.prompt.anxious': 'मैं परीक्षाओं को लेकर चिंतित हूं',
    'chat.prompt.great': 'आज मेरा दिन बहुत अच्छा था!',
    'chat.prompt.sleep': 'मुझे नींद की समस्या है',
    'chat.prompt.motivation': 'पढ़ाई के लिए प्रेरणा चाहिए',
    'chat.prompt.overwhelmed': 'हाल ही में परेशान महसूस कर रहा हूं',
    'chat.initial': 'नमस्ते! मैं आपका वेल-विशर AI सहायक हूं। मैं भावनात्मक सहायता प्रदान करने और आपके मानसिक कल्याण में मदद करने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?',
    
    // Mood Tracker
    'mood.title': 'मूड ट्रैकर',
    'mood.current': 'वर्तमान मूड',
    'mood.excellent': 'उत्कृष्ट',
    'mood.good': 'अच्छा',
    'mood.okay': 'ठीक',
    'mood.bad': 'बुरा',
    'mood.terrible': 'भयानक',
    'mood.energy': 'ऊर्जा स्तर',
    'mood.stress': 'तनाव स्तर',
    'mood.note': 'अपने दिन के बारे में एक नोट जोड़ें...',
    'mood.save': 'मूड सेव करें',
    'mood.history': 'मूड इतिहास',
    'mood.insights': 'साप्ताहिक अंतर्दृष्टि',
    'mood.week_average': 'इस सप्ताह का औसत मूड',
    'mood.improvement': '↑ पिछले सप्ताह से 15% सुधार',
    
    // Wellness Reminders
    'reminders.title': 'कल्याण अनुस्मारक',
    'reminders.subtitle': 'आपके मानसिक कल्याण के लिए स्वस्थ आदतें',
    'reminders.hydration': 'पानी पिएं',
    'reminders.hydration_desc': 'बेहतर फोकस के लिए हाइड्रेटेड रहें',
    'reminders.break': 'ब्रेक लें',
    'reminders.break_desc': 'पढ़ाई से 15 मिनट का ब्रेक लें',
    'reminders.breathing': 'श्वास व्यायाम',
    'reminders.breathing_desc': '5-मिनट का माइंडफुलनेस सेशन',
    'reminders.stretch': 'खिंचाव और हिलना-डुलना',
    'reminders.stretch_desc': 'तनाव कम करने के लिए सरल व्यायाम',
    'reminders.gratitude': 'कृतज्ञता डायरी',
    'reminders.gratitude_desc': '3 चीजें लिखें जिनके लिए आप आभारी हैं',
    'reminders.sleep': 'नींद की तैयारी',
    'reminders.sleep_desc': 'सोने से पहले आराम की दिनचर्या',
    'reminders.done': 'हो गया',
    
    // Emergency Alert
    'emergency.title': 'आपातकालीन सहायता',
    'emergency.subtitle': 'जब आपको सबसे ज्यादा जरूरत हो तो तुरंत मदद',
    'emergency.panic': 'पैनिक अलर्ट',
    'emergency.panic_desc': 'आपातकालीन संपर्कों को तुरंत SOS',
    'emergency.crisis': 'संकट हेल्पलाइन',
    'emergency.crisis_desc': '24/7 पेशेवर मानसिक स्वास्थ्य सहायता',
    'emergency.breathe': 'श्वास व्यायाम',
    'emergency.breathe_desc': 'त्वरित चिंता राहत तकनीक',
    'emergency.resources': 'स्थानीय संसाधन',
    'emergency.resources_desc': 'नजदीकी परामर्श केंद्र खोजें',
    'emergency.helpline': 'संकट हेल्पलाइन कॉल करें',
    'emergency.contacts': 'आपातकालीन संपर्कों को अलर्ट करें',
    'emergency.breathing_guide': 'श्वास व्यायाम शुरू करें',
    'emergency.find_help': 'स्थानीय सहायता खोजें',
    
    // Language Selector
    'language.select': 'भाषा चुनें',
    'language.current': 'वर्तमान: हिंदी',
    
    // Common
    'common.send': 'भेजें',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.today': 'आज',
    'common.week': 'सप्ताह',
    'common.month': 'महीना',
  },

  ta: {
    // Navigation & Headers
    'app.title': 'வெல்-விஷர் AI',
    'app.subtitle': 'உங்கள் மன நல துணை',
    'dashboard.title': 'மாணவர் மன நல டாஷ்போர்டு',
    'dashboard.subtitle': 'உணர்வு நலம் மற்றும் மன ஆரோக்கிய ஆதரவுக்கான உங்கள் தனிப்பட்ட இடம்',
    
    // Chat Assistant
    'chat.title': 'AI மன நல உதவியாளர்',
    'chat.powered': 'ஜெமினி AI ஆல் இயக்கப்படுகிறது',
    'chat.placeholder': 'நீங்கள் எப்படி உணர்கிறீர்கள் என்று பகிருங்கள் அல்லது ஆதரவு கேளுங்கள்...',
    'chat.quick_prompts': 'விரைவு தூண்டுதல்கள்:',
    'chat.prompt.anxious': 'தேர்வுகளைப் பற்றி கவலைப்படுகிறேன்',
    'chat.prompt.great': 'இன்று எனக்கு அருமையான நாள்!',
    'chat.prompt.sleep': 'தூக்கத்தில் சிக்கல் உள்ளது',
    'chat.prompt.motivation': 'படிப்பதற்கு உந்துதல் தேவை',
    'chat.prompt.overwhelmed': 'சமீபத்தில் அழுத்தம் உணர்கிறேன்',
    'chat.initial': 'வணக்கம்! நான் உங்கள் வெல்-விஷர் AI உதவியாளர். நான் உணர்வு ஆதரவு வழங்கவும் உங்கள் மன நலத்திற்கு உதவவும் இங்கே இருக்கிறேன். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?',
    
    // Mood Tracker
    'mood.title': 'மூட் டிராக்கர்',
    'mood.current': 'தற்போதைய மனநிலை',
    'mood.excellent': 'சிறந்த',
    'mood.good': 'நல்ல',
    'mood.okay': 'சரி',
    'mood.bad': 'மோசம்',
    'mood.terrible': 'மிக மோசம்',
    'mood.energy': 'ஆற்றல் நிலை',
    'mood.stress': 'மன அழுத்த நிலை',
    'mood.note': 'உங்கள் நாளைப் பற்றி ஒரு குறிப்பு சேர்க்கவும்...',
    'mood.save': 'மூட் சேமி',
    'mood.history': 'மூட் வரலாறு',
    'mood.insights': 'வாராந்திர நுண்ணறிவுகள்',
    'mood.week_average': 'இந்த வாரத்தின் சராசரி மனநிலை',
    'mood.improvement': '↑ கடந்த வாரத்திலிருந்து 15% முன்னேற்றம்',
    
    // Wellness Reminders
    'reminders.title': 'நல்வாழ்வு நினைவூட்டல்கள்',
    'reminders.subtitle': 'உங்கள் மன நலத்திற்கான ஆரோக்கியமான பழக்கங்கள்',
    'reminders.hydration': 'தண்ணீர் குடி',
    'reminders.hydration_desc': 'சிறந்த கவனம் செலுத்த நீர்ச்சத்துடன் இருங்கள்',
    'reminders.break': 'இடைவெளி எடு',
    'reminders.break_desc': 'படிப்பிலிருந்து 15 நிமிடம் விலகி இரு',
    'reminders.breathing': 'சுவாச பயிற்சி',
    'reminders.breathing_desc': '5-நிமிட நினைவாற்றல் அமர்வு',
    'reminders.stretch': 'நீட்டல் மற்றும் அசைவு',
    'reminders.stretch_desc': 'பதற்றத்தை குறைக்க எளிய பயிற்சிகள்',
    'reminders.gratitude': 'நன்றி நாட்குறிப்பு',
    'reminders.gratitude_desc': 'நீங்கள் நன்றியுள்ள 3 விஷயங்களை எழுதுங்கள்',
    'reminders.sleep': 'தூக்க தயாரிப்பு',
    'reminders.sleep_desc': 'படுக்கைக்கு முன் ஓய்வு வழக்கம்',
    'reminders.done': 'முடிந்தது',
    
    // Emergency Alert
    'emergency.title': 'அவசர ஆதரவு',
    'emergency.subtitle': 'உங்களுக்கு மிகவும் தேவையான போது உடனடி உதவி',
    'emergency.panic': 'பீதி எச்சரிக்கை',
    'emergency.panic_desc': 'உங்கள் அவசர தொடர்புகளுக்கு உடனடி SOS',
    'emergency.crisis': 'நெருக்கடி உதவி எண்',
    'emergency.crisis_desc': '24/7 தொழில்முறை மன ஆரோக்கிய ஆதரவு',
    'emergency.breathe': 'சுவாச பயிற்சி',
    'emergency.breathe_desc': 'விரைவான கவலை நிவாரண நுட்பம்',
    'emergency.resources': 'உள்ளூர் வளங்கள்',
    'emergency.resources_desc': 'அருகிலுள்ள ஆலோசனை மையங்களைக் கண்டறியவும்',
    'emergency.helpline': 'நெருக்கடி உதவி எண்ணை அழைக்கவும்',
    'emergency.contacts': 'அவசர தொடர்புகளுக்கு எச்சரிக்கை',
    'emergency.breathing_guide': 'சுவாச பயிற்சியை தொடங்கவும்',
    'emergency.find_help': 'உள்ளூர் உதவியைக் கண்டறியவும்',
    
    // Language Selector
    'language.select': 'மொழி தேர்ந்தெடு',
    'language.current': 'தற்போது: தமிழ்',
    
    // Common
    'common.send': 'அனுப்பு',
    'common.save': 'சேமி',
    'common.cancel': 'ரத்து செய்',
    'common.close': 'மூடு',
    'common.back': 'பின்னால்',
    'common.next': 'அடுத்தது',
    'common.today': 'இன்று',
    'common.week': 'வாரம்',
    'common.month': 'மாதம்',
  },

  te: {
    // Navigation & Headers
    'app.title': 'వెల్-విషర్ AI',
    'app.subtitle': 'మీ మానసిక కల్याణ సహచరుడు',
    'dashboard.title': 'విద్యార్థి మానసిక కల్याణ డ్యాష్‌బోర్డ్',
    'dashboard.subtitle': 'భావోద్వేగ సంక్షేమం మరియు మానసిక ఆరోగ్య మద్దతు కోసం మీ వ్యక్తిగత స్థలం',
    
    // Chat Assistant
    'chat.title': 'AI మానసిక కల్యాణ సహాయకుడు',
    'chat.powered': 'జెమిని AI చే శక్తిని పొందింది',
    'chat.placeholder': 'మీరు ఎలా అనుభవిస్తున్నారో చెప్పండి లేదా మద్దతు అడగండి...',
    'chat.quick_prompts': 'వేగవంతమైన ప్రాంప్ట్‌లు:',
    'chat.prompt.anxious': 'పరీక్షల గురించి ఆందోళనగా ఉంది',
    'chat.prompt.great': 'ఈరోజు నాకు గొప్ప రోజు!',
    'chat.prompt.sleep': 'నిద్రలేమితో బాధపడుతున్నాను',
    'chat.prompt.motivation': 'చదువుకోవడానికి ప్రేరణ కావాలి',
    'chat.prompt.overwhelmed': 'ఇటీవల అధిక భారంగా అనిపిస్తోంది',
    'chat.initial': 'హలో! నేను మీ వెల్-విషర్ AI సహాయకుడిని. నేను భావోద్వేగ మద్దతు అందించడానికి మరియు మీ మానసిక కల్యాణానికి సహాయం చేయడానికి ఇక్కడ ఉన్నాను. ఈరోజు మీరు ఎలా అనుభవిస్తున్నారు?',
    
    // Mood Tracker
    'mood.title': 'మూడ్ ట్రాకర్',
    'mood.current': 'ప్రస్తుత మానసిక స్థితి',
    'mood.excellent': 'అద్భుతం',
    'mood.good': 'మంచిది',
    'mood.okay': 'బాగుంది',
    'mood.bad': 'చెడ్డది',
    'mood.terrible': 'భయంకరం',
    'mood.energy': 'శక్తి స్థాయి',
    'mood.stress': 'ఒత్తిడి స్థాయి',
    'mood.note': 'మీ రోజు గురించి ఒక గమనిక జోడించండి...',
    'mood.save': 'మూడ్ సేవ్ చేయండి',
    'mood.history': 'మూడ్ చరిత్ర',
    'mood.insights': 'వారపు అంతర్దృష్టులు',
    'mood.week_average': 'ఈ వారపు సగటు మానసిక స్థితి',
    'mood.improvement': '↑ గత వారం నుండి 15% మెరుగుదల',
    
    // Wellness Reminders
    'reminders.title': 'కల్యాణ రిమైండర్లు',
    'reminders.subtitle': 'మీ మానసిక కల్యాణానికి ఆరోగ్యకరమైన అలవాట్లు',
    'reminders.hydration': 'నీరు త్రాగండి',
    'reminders.hydration_desc': 'మెరుగైన దృష్టి కోసం హైడ్రేటెడ్‌గా ఉండండి',
    'reminders.break': 'విశ్రాంతి తీసుకోండి',
    'reminders.break_desc': 'చదువుల నుండి 15 నిమిషాలు దూరంగా ఉండండి',
    'reminders.breathing': 'శ్వాస వ్యాయామం',
    'reminders.breathing_desc': '5-నిమిషాల మైండ్‌ఫుల్‌నెస్ సెషన్',
    'reminders.stretch': 'స్ట్రెచ్ & మూవ్',
    'reminders.stretch_desc': 'ఒత్తిడిని తగ్గించడానికి సాధారణ వ్యాయామాలు',
    'reminders.gratitude': 'కృతజ్ఞత డైరీ',
    'reminders.gratitude_desc': 'మీరు కృతజ్ఞతతో ఉన్న 3 విషయాలను వ్రాయండి',
    'reminders.sleep': 'నిద్ర తయారీ',
    'reminders.sleep_desc': 'పడకకు వెళ్లే ముందు విశ్రాంతి దినచర్య',
    'reminders.done': 'పూర్తైంది',
    
    // Emergency Alert
    'emergency.title': 'అత్యవసర మద్దతు',
    'emergency.subtitle': 'మీకు అత్యంత అవసరమైనప్పుడు తక్షణ సహాయం',
    'emergency.panic': 'పానిక్ అలర్ట్',
    'emergency.panic_desc': 'మీ అత్యవసర పరిచయాలకు తక్షణ SOS',
    'emergency.crisis': 'క్రైసిస్ హెల్ప్‌లైన్',
    'emergency.crisis_desc': '24/7 వృత్తిపరమైన మానసిక ఆరోగ్య మద్దతు',
    'emergency.breathe': 'శ్వాస వ్యాయామం',
    'emergency.breathe_desc': 'వేగవంతమైన ఆందోళన ఉపశమన టెక్నిక్',
    'emergency.resources': 'స్థానిక వనరులు',
    'emergency.resources_desc': 'సమీపంలోని కౌన్సెలింగ్ సెంటర్లను కనుగొనండి',
    'emergency.helpline': 'క్రైసిస్ హెల్ప్‌లైన్‌కు కాల్ చేయండి',
    'emergency.contacts': 'అత్యవసర పరిచయాలను అలర్ట్ చేయండి',
    'emergency.breathing_guide': 'శ్వాస వ్యాయామం ప్రారంభించండి',
    'emergency.find_help': 'స్థానిక సహాయం కనుగొనండి',
    
    // Language Selector
    'language.select': 'భాష ఎంచుకోండి',
    'language.current': 'ప్రస్తుతం: తెలుగు',
    
    // Common
    'common.send': 'పంపండి',
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.close': 'మూసివేయండి',
    'common.back': 'వెనుకకు',
    'common.next': 'తదుపరి',
    'common.today': 'ఈరోజు',
    'common.week': 'వారం',
    'common.month': 'నెల',
  },

  bn: {
    // Navigation & Headers
    'app.title': 'ওয়েল-উইশার AI',
    'app.subtitle': 'আপনার মানসিক স্বাস্থ্যের সঙ্গী',
    'dashboard.title': 'ছাত্র মানসিক স্বাস্থ্য ড্যাশবোর্ড',
    'dashboard.subtitle': 'আবেগজনিত সুস্বাস্থ্য এবং মানসিক স্বাস্থ্য সহায়তার জন্য আপনার ব্যক্তিগত স্থান',
    
    // Chat Assistant
    'chat.title': 'AI মানসিক স্বাস্থ্য সহায়ক',
    'chat.powered': 'জেমিনি AI দ্বারা চালিত',
    'chat.placeholder': 'আপনি কেমন অনুভব করছেন তা শেয়ার করুন বা সাহায্য চান...',
    'chat.quick_prompts': 'দ্রুত প্রম্পট:',
    'chat.prompt.anxious': 'পরীক্ষা নিয়ে উদ্বিগ্ন বোধ করছি',
    'chat.prompt.great': 'আজ আমার দারুণ দিন কেটেছে!',
    'chat.prompt.sleep': 'ঘুমের সমস্যায় ভুগছি',
    'chat.prompt.motivation': 'পড়াশোনার জন্য অনুপ্রেরণা দরকার',
    'chat.prompt.overwhelmed': 'সম্প্রতি অভিভূত বোধ করছি',
    'chat.initial': 'হ্যালো! আমি আপনার ওয়েল-উইশার AI সহায়ক। আমি আবেগজনিত সহায়তা প্রদান করতে এবং আপনার মানসিক স্বাস্থ্যে সাহায্য করতে এখানে আছি। আজ আপনি কেমন বোধ করছেন?',
    
    // Mood Tracker
    'mood.title': 'মুড ট্র্যাকার',
    'mood.current': 'বর্তমান মুড',
    'mood.excellent': 'চমৎকার',
    'mood.good': 'ভালো',
    'mood.okay': 'ঠিক আছে',
    'mood.bad': 'খারাপ',
    'mood.terrible': 'ভয়ঙ্কর',
    'mood.energy': 'শক্তির মাত্রা',
    'mood.stress': 'চাপের মাত্রা',
    'mood.note': 'আপনার দিন সম্পর্কে একটি নোট যোগ করুন...',
    'mood.save': 'মুড সেভ করুন',
    'mood.history': 'মুডের ইতিহাস',
    'mood.insights': 'সাপ্তাহিক অন্তর্দৃষ্টি',
    'mood.week_average': 'এই সপ্তাহের গড় মুড',
    'mood.improvement': '↑ গত সপ্তাহ থেকে ১৫% উন্নতি',
    
    // Wellness Reminders
    'reminders.title': 'সুস্বাস্থ্যের অনুস্মারক',
    'reminders.subtitle': 'আপনার মানসিক স্বাস্থ্যের জন্য স্বাস্থ্যকর অভ্যাস',
    'reminders.hydration': 'পানি পান করুন',
    'reminders.hydration_desc': 'ভাল মনোযোগের জন্য হাইড্রেটেড থাকুন',
    'reminders.break': 'বিরতি নিন',
    'reminders.break_desc': 'পড়াশোনা থেকে ১৫ মিনিটের বিরতি নিন',
    'reminders.breathing': 'শ্বাস প্রশ্বাসের ব্যায়াম',
    'reminders.breathing_desc': '৫-মিনিটের মাইন্ডফুলনেস সেশন',
    'reminders.stretch': 'স্ট্রেচ ও নড়াচড়া',
    'reminders.stretch_desc': 'টান কমানোর জন্য সহজ ব্যায়াম',
    'reminders.gratitude': 'কৃতজ্ঞতার ডায়েরি',
    'reminders.gratitude_desc': 'যে ৩টি বিষয়ের জন্য আপনি কৃতজ্ঞ তা লিখুন',
    'reminders.sleep': 'ঘুমের প্রস্তুতি',
    'reminders.sleep_desc': 'শোয়ার আগে বিশ্রামের রুটিন',
    'reminders.done': 'সম্পন্ন',
    
    // Emergency Alert
    'emergency.title': 'জরুরি সাহায্য',
    'emergency.subtitle': 'যখন আপনার সবচেয়ে বেশি প্রয়োজন তখন তাৎক্ষণিক সাহায্য',
    'emergency.panic': 'প্যানিক অ্যালার্ট',
    'emergency.panic_desc': 'আপনার জরুরি যোগাযোগকারীদের তাৎক্ষণিক SOS',
    'emergency.crisis': 'সংকট হেল্পলাইন',
    'emergency.crisis_desc': '২৪/৷ পেশাদার মানসিক স্বাস্থ্য সহায়তা',
    'emergency.breathe': 'শ্বাস প্রশ্বাসের ব্যায়াম',
    'emergency.breathe_desc': 'দ্রুত উদ্বেগ নিরাময়ের কৌশল',
    'emergency.resources': 'স্থানীয় সংস্থান',
    'emergency.resources_desc': 'কাছাকাছি কাউন্সেলিং কেন্দ্র খুঁজুন',
    'emergency.helpline': 'সংকট হেল্পলাইনে কল করুন',
    'emergency.contacts': 'জরুরি যোগাযোগকারীদের সতর্ক করুন',
    'emergency.breathing_guide': 'শ্বাস প্রশ্বাসের ব্যায়াম শুরু করুন',
    'emergency.find_help': 'স্থানীয় সাহায্য খুঁজুন',
    
    // Language Selector
    'language.select': 'ভাষা নির্বাচন করুন',
    'language.current': 'বর্তমান: বাংলা',
    
    // Common
    'common.send': 'পাঠান',
    'common.save': 'সেভ করুন',
    'common.cancel': 'বাতিল করুন',
    'common.close': 'বন্ধ করুন',
    'common.back': 'পিছনে',
    'common.next': 'পরবর্তী',
    'common.today': 'আজ',
    'common.week': 'সপ্তাহ',
    'common.month': 'মাস',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};