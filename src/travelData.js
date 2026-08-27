/**
 * Ocean Travel - Master Destinations & Attractions Data
 * Over 10+ distinct curated places per destination with individual photos,
 * rich Myanmar translations, and zero bundled collections.
 */
export const defaultTravelData = {
  countries: [
    {
      id: "vietnam",
      name: "Vietnam",
      code: "VN",
      flag: "🇻🇳",
      heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      tagline: "Ancient heritage, limestone seascapes, and vibrant culinary traditions.",
      cities: ["danang", "hanoi", "hochiminh"]
    },
    {
      id: "singapore",
      name: "Singapore",
      code: "SG",
      flag: "🇸🇬",
      heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      tagline: "Futuristic architecture, lush tropical gardens, and world-class culinary wonders.",
      cities: ["singapore_city"]
    },
    {
      id: "malaysia",
      name: "Malaysia",
      code: "MY",
      flag: "🇲🇾",
      heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      tagline: "Iconic skylines, multicultural heritage, and world-famous street delicacies.",
      cities: ["kualalumpur"]
    }
  ],
  cities: {
    danang: {
      id: "danang",
      countryId: "vietnam",
      name: "Da Nang",
      heroImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
      tagline: "Golden Bridge, Marble Mountains, Pristine Beaches & River City",
      places: [
        {
          id: "dn_goldenbridge",
          name: "Golden Bridge (Hands of God)",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Top Attraction",
          isMustVisit: true,
          popularity: 99,
          durationHours: 3.0,
          durationText: "3.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
          location: "Ba Na Hills Resort, Hoa Vang District",
          myanmarDesc: "တိမ်ပင်လယ်များအထက် ပင်လယ်ရေမျက်နှာပြင် မီတာ ၁၄၀၀ ကျော်တွင် တည်ရှိပြီး ဧရာမ ကျောက်လက်ကြီးနှစ်ဖက်က ကောင်းကင်သို့ မိုးတင်ထားသည့် ကမ္ဘာကျော် ရွှေရောင်လက်တံတားကြီး (Golden Bridge) ဖြစ်ပါသည်။ မီတာ ၁၅၀ ရှည်လျားသော တံတားပေါ်မှ အနန္တတောင်တန်းရှုခင်းများနှင့် တိမ်ပင်လယ်များကို ငေးမောကြည့်ရှုကာ အမှတ်တရ ဓာတ်ပုံရိုက်ကူးနိုင်ပါသည်။",
          myanmarHighlights: [
            "ကမ္ဘာကျော် Giant Hands ရွှေရောင်လက်တံတားပေါ်တွင် အမှတ်တရ ဓာတ်ပုံရိုက်ကူးနိုင်ခြင်း",
            "တိမ်လွှာများအလယ် ပန်းပင်မျိုးစုံ ပွင့်လန်းရာ လှပသော လမ်းလျှောက်တံတားရှုခင်း",
            "နံနက်ခင်းနှင့် ညနေခင်း နေဝင်ဆည်းဆာချိန်များတွင် အလှဆုံး မြင်ကွင်းရရှိခြင်း"
          ]
        },
        {
          id: "dn_frenchvillage",
          name: "French Village & Fantasy Park",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit European Charm",
          isMustVisit: true,
          popularity: 97,
          durationHours: 3.0,
          durationText: "3.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
          location: "Ba Na Hills Peak, Da Nang",
          myanmarDesc: "ပြင်သစ် ၁၉ ရာစု ဂန္ထဝင် ရဲတိုက်ကြီးများနှင့် ရှေးဟောင်းဥရောပ မြို့ပြဗိသုကာပုံစံ ဖန်တီးတည်ဆောက်ထားသော ပြင်သစ်ရွာ (French Village) ဖြစ်ပါသည်။ အေးချမ်းသော တောင်ပေါ်ရာသီဥတုတွင် လမ်းလျှောက်လည်ပတ်နိုင်ပြီး အဆောက်အအုံအတွင်းရှိ Fantasy Park ကစားကွင်း၊ ရိုးရာဘီယာချက်စက်ရုံနှင့် ပြင်သစ်စားသောက်ဆိုင်များကို တွေ့ကြုံခံစားနိုင်ပါသည်။",
          myanmarHighlights: [
            "ဥရောပ ဂန္ထဝင် ရဲတိုက်ပုံစံ ဗိသုကာလက်ရာများနှင့် ဓာတ်ပုံရိုက်ရန် အထူးကောင်းမွန်ခြင်း",
            "Fantasy Park အတွင်းရှိ စိတ်လှုပ်ရှားဖွယ် 3D/4D/5D ကစားနည်းများနှင့် ဂိမ်းများ",
            "ပြင်သစ်စတိုင် ကော်ဖီဆိုင်များနှင့် လမ်းဘေး တိုက်ရိုက်ဖျော်ဖြေပွဲများ"
          ]
        },
        {
          id: "dn_cablecar",
          name: "Ba Na Hills Scenic Cable Car",
          category: "nature",
          categoryLabel: "🚠 World Record Cable Car",
          isMustVisit: true,
          popularity: 96,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
          location: "Hoa Ninh, Hoa Vang, Da Nang",
          myanmarDesc: "ဂင်းနစ်ကမ္ဘာ့စံချိန်တင် ကမ္ဘာ့အရှည်ဆုံးနှင့် အမြင့်ဆုံး တောင်တက် ကေဘယ်ကားစနစ် ဖြစ်ပါသည်။ တောင်ခြေမှ တောင်ထိပ်သို့ ၂၀ မိနစ်ကြာ စီးနင်းစဉ် သစ်တောစိမ်းလန်းစိုပြေမှု၊ သဘာဝ ရေတံခွန်ကြီးများနှင့် မြူခိုးဆိုင်းနေသော တောင်တန်းကြီးများကို ငှက်မျက်စိမြင်ကွင်းဖြင့် ကြည့်ရှုခံစားနိုင်ပါသည်။",
          myanmarHighlights: [
            "ကမ္ဘာ့ဂင်းနစ်စံချိန်တင် တစ်ဆက်တည်း အရှည်ဆုံး ကေဘယ်ကား စီးနင်းမှု အတွေ့အကြုံ",
            "တောင်ကြား ရေတံခွန်ကြီးများနှင့် သဘာဝတောတောင် မြင်ကွင်းကျယ်များ",
            "ခေတ်မီပြီး အလွန်ဘေးကင်းလုံခြုံသော ဆွစ်ဇာလန် နည်းပညာသုံး ကေဘယ်ကားများ"
          ]
        },
        {
          id: "dn_dragonbridge",
          name: "Dragon Bridge (Cau Rong)",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Iconic Landmark",
          isMustVisit: true,
          popularity: 95,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
          location: "Han River, Central Da Nang",
          myanmarDesc: "ဟန်မြစ်ကို ဖြတ်သန်းတည်ဆောက်ထားသော အလျား ၆၆၆ မီတာရှိသည့် ရွှေရောင်နဂါးပုံစံ သံမဏိတံတားကြီးဖြစ်ပြီး ဒါနန်းမြို့၏ အထင်ရှားဆုံး ပြယုဂ်ဖြစ်ပါသည်။ စနေနှင့် တနင်္ဂနွေ ည ၉:၀၀ နာရီတိုင်းတွင် နဂါးကြီး၏ ပါးစပ်မှ မီးနှင့် ရေများ အလှည့်ကျ မှုတ်ထုတ်ပြသသည့် ခမ်းနားသော ရှိုးပွဲကို အခမဲ့ ကြည့်ရှုနိုင်ပါသည်။",
          myanmarHighlights: [
            "စနေ၊ တနင်္ဂနွေ ည ၉:၀၀ နာရီ မီးမှုတ်/ရေမှုတ် ရှိုးပွဲကို အနီးကပ် ကြည့်ရှုနိုင်ခြင်း",
            "ညဘက် LED မီးရောင်စုံ ချိန်ညှိမှုကြောင့် အလွန်တောက်ပလှပသော မြစ်ကမ်းရှုခင်း",
            "ဟန်မြစ်ဘေး လမ်းလျှောက်လမ်းမကြီးတွင် ဒေသခံများနှင့်အတူ လေညင်းခံနိုင်ခြင်း"
          ]
        },
        {
          id: "dn_marblemountains",
          name: "Marble Mountains (Ngu Hanh Son)",
          category: "culture",
          categoryLabel: "🏛️ Natural Caves & Pagodas",
          isMustVisit: true,
          popularity: 94,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
          location: "Hoa Hai, Ngu Hanh Son, Da Nang",
          myanmarDesc: "သဘာဝ ဓာတ်ကြီးငါးပါး (သတ္တု၊ သစ်သား၊ ရေ၊ မီး၊ မြေ) ကို ကိုယ်စားပြုသော စကျင်ကျောက်တောင်ကုန်း ငါးခုဖြစ်ပါသည်။ တောင်ပေါ်ရှိ သဘာဝ ထုံးကျောက်ဂူကြီးများအတွင်း ရှေးဟောင်းဗုဒ္ဓဆင်းတုတော်များ၊ Linh Ung ဘုရားကျောင်းနှင့် Huyen Khong လှိုဏ်ဂူအတွင်းသို့ နေရောင်ခြည် ကျရောက်သည့် ထူးခြားသော မြင်ကွင်းကို လေ့လာဖူးမြော်နိုင်ပါသည်။",
          myanmarHighlights: [
            "Huyen Khong ဂူကြီးအတွင်း ကောင်းကင်ပေါက်မှ နေရောင်ခြည်ထိုးဆင်းသည့် အံ့ဖွယ်ရှုခင်း",
            "တောင်ထိပ် Observation Point ပေါ်မှ ဒါနန်းမြို့နှင့် ကမ်းခြေမြင်ကွင်းကျယ် ကြည့်ရှုနိုင်ခြင်း",
            "ကျောက်တောင်တက် ဓာတ်လှေကား (Elevator) ပါရှိသဖြင့် သက်ကြီးရွယ်အိုများပါ အဆင်ပြေခြင်း"
          ]
        },
        {
          id: "dn_linhungladybudha",
          name: "Linh Ung Pagoda & Lady Buddha",
          category: "culture",
          categoryLabel: "🏛️ Sacred Temple & Coastal View",
          isMustVisit: true,
          popularity: 93,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
          location: "Son Tra Peninsula, Da Nang",
          myanmarDesc: "ဆွန်ထရာကျွန်းဆွယ် (Son Tra) ပေါ်တွင် တည်ရှိပြီး ၆၇ မီတာ (အထပ် ၃၀ အမြင့်) ရှိသော ဗီယက်နမ်နိုင်ငံ၏ အမြင့်ဆုံး မယ်တော်ဂိုအန်ရင် (Lady Buddha) ရုပ်တုတော်ကြီး တည်ရှိပါသည်။ ပင်လယ်ပြာကြီးနှင့် ဒါနန်းမြို့ကမ်းရိုးတန်းတစ်ခုလုံးကို အပေါ်စီးမှ ကြည်လင်ပြတ်သားစွာ မြင်တွေ့နိုင်ပါသည်။",
          myanmarHighlights: [
            "၆၇ မီတာ အမြင့်ရှိ ဖြူစင်သပ္ပာယ်သော ဧရာမ မယ်တော်ရုပ်တုတော်ကြီးအား ဖူးမြော်နိုင်ခြင်း",
            "ဆွန်ထရာကျွန်းဆွယ် ပင်လယ်အော်နှင့် ဒါနန်းမြို့ပြ အလှဆုံး ကမ်းရိုးတန်း ရှုမျှော်ခင်း",
            "အေးချမ်းသာယာသော ဘုရားကျောင်းပရဝုဏ်နှင့် သစ်ပင်ပန်းမန် ဥယျာဉ်တော်များ"
          ]
        },
        {
          id: "dn_mykhebeach",
          name: "My Khe Beach & Seaside Promenade",
          category: "nature",
          categoryLabel: "🏖️ World Top Rated Beach",
          isMustVisit: false,
          popularity: 91,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          location: "Vo Nguyen Giap, Son Tra, Da Nang",
          myanmarDesc: "Forbes မဂ္ဂဇင်းမှ ကမ္ဘာ့အဆွဲဆောင်မှုအရှိဆုံး ကမ်းခြေတစ်ခုအဖြစ် သတ်မှတ်ခံထားရသည့် မိုင်ခေးကမ်းခြေ ဖြစ်ပါသည်။ အလျား ၁၀ ကီလိုမီတာ ရှည်လျားသော သဲဖြူသောင်ပြင်၊ ကြည်လင်နူးညံ့သော ပင်လယ်လှိုင်းများနှင့် အုန်းပင်ရိပ်များအောက်တွင် အနားယူခြင်း၊ ရေကူးခြင်းနှင့် နေဝင်ချိန် လမ်းလျှောက်ခြင်းတို့ ပြုလုပ်နိုင်ပါသည်။",
          myanmarHighlights: [
            "နူးညံ့ဖြူစင်သော သဲသောင်ပြင်တွင် လမ်းလျှောက်အပန်းဖြေခြင်းနှင့် ရေကစားခြင်း",
            "ကမ်းခြေတစ်လျှောက်ရှိ အဆင့်မြင့် ကမ်းခြေကလပ်များနှင့် လတ်ဆတ်သော အုန်းရည်သောက်သုံးနိုင်ခြင်း",
            "ဂျက်စကီး (Jet Ski) နှင့် လေထီးစီးခြင်း (Parasailing) စသည့် ကစားနည်းများ"
          ]
        },
        {
          id: "dn_hoianancienttown",
          name: "Hoi An Ancient Town & Lantern Street",
          category: "culture",
          categoryLabel: "⭐ UNESCO World Heritage",
          isMustVisit: true,
          popularity: 98,
          durationHours: 4.5,
          durationText: "Half Day (4.5 Hours)",
          imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
          location: "Hoi An City (30 mins from Da Nang)",
          myanmarDesc: "ယူနက်စကို ကမ္ဘာ့အမွေအနှစ်စာရင်းဝင် ရှေးဟောင်း ဟွိုင်အန်းမြို့ငယ်လေးသည် ၁၆ ရာစု ကုန်သွယ်ဆိပ်ကမ်းဟောင်းဖြစ်ပြီး အဝါရောင် ရှေးဟောင်းအိမ်ကလေးများ၊ ဂျပန်တံတား (Japanese Covered Bridge) နှင့် ညဘက်တွင် ထောင်သောင်းချီသော ရိုးရာမီးပုံးရောင်စုံများဖြင့် လင်းထိန်နေသည့် အလွန်လှပသော နေရာဖြစ်ပါသည်။",
          myanmarHighlights: [
            "ရိုးရာမီးပုံးများ လင်းထိန်နေသော လမ်းကြားများတွင် လှပစွာ လမ်းလျှောက် လည်ပတ်နိုင်ခြင်း",
            "Thu Bon မြစ်အတွင်း သစ်သားလှေစီး၍ ရေပေါ်မီးပုံး (Floating Lantern) မျှောနိုင်ခြင်း",
            "ရိုးရာ ချည်ထည်များ၊ ပိုးထည်များနှင့် ရိုးရာအစားအစာ ကောင်းများစွာ စုံလင်ခြင်း"
          ]
        },
        {
          id: "dn_hanrivercruise",
          name: "Han River Night Cruise",
          category: "must_visit",
          categoryLabel: "🚢 Evening River Experience",
          isMustVisit: false,
          popularity: 90,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
          location: "Bach Dang Wharf, Han River",
          myanmarDesc: "ညနေစောင်းနှင့် ညအချိန်တွင် ဟန်မြစ်အတွင်း ခေတ်မီအပျော်စီးသင်္ဘောကြီးများ စီးနင်းကာ ဒါနန်းမြို့၏ နဂါးတံတား၊ ဟန်မြစ်တံတားနှင့် မြို့ပြမီးရောင်စုံများကို မြစ်လယ်မှ လေညင်းခံ ကြည့်ရှုခံစားနိုင်သော အပန်းဖြေခရီးစဉ် ဖြစ်ပါသည်။ သင်္ဘောပေါ်တွင် ဗီယက်နမ်ရိုးရာ Cham အကဖျော်ဖြေပွဲများကိုပါ ကြည့်ရှုနိုင်ပါသည်။",
          myanmarHighlights: [
            "ဟန်မြစ်တစ်လျှောက်ရှိ အလှဆုံး တံတား ၅ စင်းနှင့် မိုးမျှော်တိုက် မီးရောင်များကို မြစ်လယ်မှ ကြည့်ရှုနိုင်ခြင်း",
            "သင်္ဘောပေါ်တွင် သစ်သီးအအေး သောက်သုံးရင်း ရိုးရာ Cham အက ဖျော်ဖြေမှု ကြည့်ရှုနိုင်ခြင်း",
            "စနေ၊ တနင်္ဂနွေ ညများတွင် နဂါးတံတား မီးမှုတ်ပွဲကို မြစ်လယ်မှ ရှုထောင့်အသစ်ဖြင့် တွေ့မြင်နိုင်ခြင်း"
          ]
        },
        {
          id: "dn_hanmarket",
          name: "Han Market (Cho Han) Local Market",
          category: "food",
          categoryLabel: "🍜 Souvenirs & Street Delicacies",
          isMustVisit: false,
          popularity: 89,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          location: "119 Tran Phu, Hai Chau 1, Da Nang",
          myanmarDesc: "၁၉၄၀ ပြည့်လွန်နှစ်များကတည်းက တည်ရှိခဲ့သော ဒါနန်းမြို့၏ အစည်ကားဆုံး သမိုင်းဝင် ဈေးကြီးဖြစ်ပါသည်။ ဗီယက်နမ် အမှတ်တရပစ္စည်းများ၊ ရိုးရာ အဝတ်အထည်များ၊ ပင်လယ်စာခြောက်များ၊ ကော်ဖီစေ့များနှင့် နာမည်ကြီး Mi Quang ခေါက်ဆွဲ၊ Banh Xeo မုန့်ကြွပ်ကြော်များကို သက်သာသော ဈေးနှုန်းဖြင့် ဝယ်ယူစားသောက်နိုင်ပါသည်။",
          myanmarHighlights: [
            "ဗီယက်နမ် ဒေသထွက် ကော်ဖီစစ်စစ်များ၊ မုန့်များနှင့် အမှတ်တရပစ္စည်းများ ဝယ်ယူရန် အကောင်းဆုံး",
            "ဒေသခံတို့၏ စစ်မှန်သော ရိုးရာ ဈေးယဉ်ကျေးမှုကို အနီးကပ် ထိတွေ့နိုင်ခြင်း",
            "ဈေးအတွင်းရှိ စားသောက်တန်းတွင် ဒေသထွက် ရိုးရာမုန့်မျိုးစုံ မြည်းစမ်းနိုင်ခြင်း"
          ]
        },
        {
          id: "dn_chammuseum",
          name: "Museum of Cham Sculpture",
          category: "culture",
          categoryLabel: "🏛️ Ancient Champa Art & History",
          isMustVisit: false,
          popularity: 87,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
          location: "No. 02, 2 Thang 9 Street, Hai Chau, Da Nang",
          myanmarDesc: "ပြင်သစ်ရှေးဟောင်းသုတေသနပညာရှင်များ စတင်စုဆောင်းခဲ့သော ကမ္ဘာ့အကြီးမားဆုံး ရှေးဟောင်း ချမ်ပါ (Cham) ယဉ်ကျေးမှု ကျောက်ဆစ်လက်ရာ ပြတိုက်ကြီး ဖြစ်ပါသည်။ အေဒီ ၅ ရာစုမှ ၁၅ ရာစုအတွင်း ထုဆစ်ခဲ့သော ဟိန္ဒူနှင့် ဗုဒ္ဓဘာသာဆိုင်ရာ သဲကျောက်ရုပ်ကြွလက်ရာပေါင်း ရာနှင့်ချီ ခင်းကျင်းပြသထားပါသည်။",
          myanmarHighlights: [
            "ကမ္ဘာပေါ်တွင် အပြည့်စုံဆုံး ရှေးဟောင်း Champa ယဉ်ကျေးမှု ကျောက်ဆစ်ရုပ်ကြွများ",
            "ပြင်သစ်ကိုလိုနီခေတ် ဂန္ထဝင် ဗိသုကာလက်ရာဖြင့် တည်ဆောက်ထားသော ပြတိုက်ဝင်း",
            "အရှေ့တောင်အာရှ ရှေးဟောင်းသမိုင်းကြောင်းကို နက်နက်နဲနဲ လေ့လာနိုင်ခြင်း"
          ]
        },
        {
          id: "dn_sontrapeninsula",
          name: "Son Tra Peninsula & Monkey Mountain",
          category: "nature",
          categoryLabel: "🌿 Lush Coastal Lookout",
          isMustVisit: false,
          popularity: 88,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          location: "Son Tra Nature Reserve, Da Nang",
          myanmarDesc: "ဒါနန်းမြို့၏ အဆုတ်သဖွယ် တည်ရှိသော သဘာဝ သစ်တောကြိုးဝိုင်းကြီးဖြစ်ပြီး ရှားပါး ရွှေရောင်မျက်မှန်မျောက်များ (Red-shanked Douc Langur) နေထိုင်ရာ ဒေသဖြစ်ပါသည်။ Ban Co တောင်ထိပ်ပေါ်မှ ဒါနန်းမြို့တစ်မြို့လုံး၊ ဟန်မြစ်နှင့် ပင်လယ်ပြာကြီးကို ၃၆၀ ဒီဂရီ ရှုမျှော်နိုင်ပါသည်။",
          myanmarHighlights: [
            "Ban Co Peak တောင်ထိပ် ရှုမျှော်စင်ပေါ်မှ သဘာဝတောတောင်နှင့် မြို့ပြအလှ မြင်ကွင်း",
            "ရှားပါး တောရိုင်းတိရစ္ဆာန်များနှင့် သဘာဝဂေဟစနစ်ကို လေ့လာနိုင်ခြင်း",
            "ပင်လယ်ကွေ့ဘေး ဖောက်လုပ်ထားသော လှပသည့် တောင်ပတ်လမ်းမကြီး"
          ]
        }
      ]
    },
    hanoi: {
      id: "hanoi",
      countryId: "vietnam",
      name: "Hanoi",
      heroImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      tagline: "Centuries-old Architecture & The Cultural Soul of Vietnam",
      places: [
        {
          id: "hn_hoankiem",
          name: "Hoan Kiem Lake & Ngoc Son Temple",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Landmark",
          isMustVisit: true,
          popularity: 98,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
          location: "Hoan Kiem District, Central Hanoi",
          myanmarDesc: "ဟနွိုင်းမြို့၏ အသည်းနှလုံးဟု တင်စားခေါ်ဝေါ်ကြသော ဟွမ်ကီယမ် ရေကန်သည် သာယာလှပပြီး ရေလယ်ကျွန်းငယ်ပေါ်တွင် သမိုင်းဝင် ငေါ့ဆွန်း ဘုရားကျောင်း (Ngoc Son Temple) တည်ရှိပါသည်။ ရေကန်ပတ်လည်တွင် သစ်ပင်ရိပ်များအောက် လမ်းလျှောက် အပန်းဖြေနိုင်ပြီး ဒေသခံတို့၏ လူနေမှုဓလေ့ကို အနီးကပ် လေ့လာခံစားနိုင်ပါသည်။",
          myanmarHighlights: [
            "အနီရောင် သစ်သားတံတား (The Huc Bridge) ပေါ်တွင် ဓာတ်ပုံရိုက်ရန် အထူးလှပခြင်း",
            "ညဘက်တွင် မီးရောင်စုံများဖြင့် လွန်စွာဆွဲဆောင်မှုရှိသော ရေကန်ရှုခင်း",
            "ဟနွိုင်းရှေးဟောင်း ရပ်ကွက်နှင့် ကပ်လျက်ရှိသဖြင့် သွားလာရ လွယ်ကူခြင်း"
          ]
        },
        {
          id: "hn_oldquarter",
          name: "Hanoi Old Quarter (36 Historic Streets)",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Cultural Walk",
          isMustVisit: true,
          popularity: 97,
          durationHours: 3.0,
          durationText: "3.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
          location: "Old Quarter, Hoan Kiem, Hanoi",
          myanmarDesc: "နှစ်ပေါင်းရာချီ သက်တမ်းရှိသော ဟနွိုင်း ရှေးဟောင်းရပ်ကွက်သည် သမိုင်းဝင် လမ်းသွယ်ပေါင်း ၃၆ သွယ်ဖြင့် ဖွဲ့စည်းထားပြီး လက်မှုအနုပညာပစ္စည်းများ၊ ပိုးထည်များ၊ ရှေးဟောင်း ပြင်သစ်ကိုလိုနီ ဗိသုကာလက်ရာများနှင့် စည်ကားသိုက်မြိုက်သော ညဈေးတန်းများကို လည်ပတ်တွေ့ကြုံနိုင်ပါသည်။",
          myanmarHighlights: [
            "ဗီယက်နမ်ရိုးရာ ကြက်ဥကော်ဖီ (Egg Coffee) မဖြစ်မနေ သောက်သုံးနိုင်ခြင်း",
            "ရှေးဟောင်းလမ်းများအတိုင်း ဆိုက်ကား (Cyclo) စီး၍ မြို့လေ့လာနိုင်ခြင်း",
            "အရည်အသွေးမြင့် လက်ဆောင်ပစ္စည်းများနှင့် အမှတ်တရပစ္စည်းများ ဝယ်ယူရန် အကောင်းဆုံးနေရာ"
          ]
        },
        {
          id: "hn_phobatdan",
          name: "Pho Gia Truyen Bat Dan (Famous Beef Pho)",
          category: "food",
          categoryLabel: "🍜 Famous Food & Dining",
          isMustVisit: true,
          popularity: 94,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
          location: "49 Bat Dan Street, Hoan Kiem, Hanoi",
          myanmarDesc: "ဟနွိုင်းမြို့၏ အကျော်ကြားဆုံးနှင့် မျိုးဆက်ပေါင်းများစွာ လက်ဆင့်ကမ်းလာသော ရိုးရာ အမဲသားဖို (Phở Bò) ဆိုင်ဖြစ်ပါသည်။ မွှေးကြိုင်လှသော ရိုးတွင်းခြင်ဆီ ဟင်းရည်စစ်စစ်၊ နူးညံ့လတ်ဆတ်သော အမဲသားနှင့် လတ်ဆတ်သော ဆန်ခေါက်ဆွဲတို့၏ အရသာကို စစ်မှန်သော ဗီယက်နမ်ရိုးရာ အငွေ့အသက်နှင့်အတူ မြည်းစမ်းနိုင်ပါသည်။",
          myanmarHighlights: [
            "Michelin Selected စာရင်းဝင် စစ်မှန်သော ဟနွိုင်းစတိုင် ဖိုခေါက်ဆွဲ",
            "ဆူပွက်နေသော ဟင်းရည်မွှေးမွှေးနှင့် အကြွပ်ကြော် ပေါင်မုန့်ချောင်း (Quẩy) တို့ တွဲဖက်သုံးဆောင်နိုင်ခြင်း"
          ]
        },
        {
          id: "hn_templelit",
          name: "Temple of Literature (Van Mieu)",
          category: "culture",
          categoryLabel: "🏛️ Heritage & History",
          isMustVisit: false,
          popularity: 90,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
          location: "58 Quoc Tu Giam, Dong Da, Hanoi",
          myanmarDesc: "အေဒီ ၁၀၇၀ ပြည့်နှစ်တွင် တည်ထောင်ခဲ့သော ဗီယက်နမ်နိုင်ငံ၏ ပထမဆုံးသော တက္ကသိုလ်ဖြစ်ပြီး ကွန်ဖြူးရှပ်စ် ပညာရှိကြီးအား ရည်စူးတည်ဆောက်ထားသည့် သမိုင်းဝင် ရှေးဟောင်းဗိသုကာ အဆောက်အအုံ ဖြစ်ပါသည်။ လှပသော ဥယျာဉ်များနှင့် ရှေးဟောင်းကျောက်စာချပ်ကြီးများကို လေ့လာနိုင်ပါသည်။",
          myanmarHighlights: [
            "ဗီယက်နမ် ပညာရေးသမိုင်းကြောင်းနှင့် ရှေးဟောင်းဗိသုကာလက်ရာများ လေ့လာနိုင်ခြင်း",
            "အေးချမ်းတိတ်ဆိတ်သော ရှေးဟောင်းဥယျာဉ်ဝင်းအတွင်း အနားယူနိုင်ခြင်း"
          ]
        },
        {
          id: "hn_tranquoctemple",
          name: "Tran Quoc Pagoda & West Lake",
          category: "culture",
          categoryLabel: "🏛️ Oldest Buddhist Pagoda",
          isMustVisit: false,
          popularity: 89,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
          location: "Thanh Nien, Tay Ho, Hanoi",
          myanmarDesc: "နှစ်ပေါင်း ၁၅၀၀ ကျော် သက်တမ်းရှိသော ဟနွိုင်းမြို့၏ သက်တမ်းအရင့်ဆုံး ဗုဒ္ဓဘာသာ စေတီတော်ဖြစ်ပြီး အနောက်ဘက်ရေကန်ကြီး (West Lake) ၏ ကျွန်းငယ်ပေါ်တွင် တည်ရှိပါသည်။ ရေမျက်နှာပြင်ထက် ထိုးထွက်နေသော ၁၁ ထပ် အနီရောင်စေတီတော်နှင့် ဗောဓိညောင်ပင်တော်ကို ဖူးမြော်နိုင်ပါသည်။",
          myanmarHighlights: [
            "ဟနွိုင်း၏ သက်တမ်းအရင့်ဆုံး ရှေးဟောင်းဗုဒ္ဓစေတီတော်ကို ဖူးမြော်နိုင်ခြင်း",
            "West Lake ကန်ကြီး၏ နေဝင်ဆည်းဆာ အလှကို အနီးကပ် ခံစားနိုင်ခြင်း"
          ]
        },
        {
          id: "hn_stjoseph",
          name: "St. Joseph's Cathedral & Cafe Street",
          category: "culture",
          categoryLabel: "⛪ Neo-Gothic Landmark",
          isMustVisit: false,
          popularity: 88,
          durationHours: 1.5,
          durationText: "1.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
          location: "40 Nha Chung, Hang Trong, Hoan Kiem",
          myanmarDesc: "၁၉ ရာစုနှောင်းပိုင်းတွင် နော့ထရီဒမ် ကသီဒြယ်ပုံစံ တည်ဆောက်ခဲ့သော နီယိုဂေါသစ် ဗိသုကာစတိုင် ခရစ်ယာန်ဘုရားကျောင်းကြီး ဖြစ်ပါသည်။ ဘုရားကျောင်းပတ်လည်ရှိ လမ်းဘေး ကော်ဖီဆိုင်များတွင် ထိုင်ရင်း သံပုရာလက်ဖက်ရည်နှင့် ကော်ဖီသောက်သုံးရန် နာမည်ကြီးပါသည်။",
          myanmarHighlights: [
            "ပြင်သစ်ကိုလိုနီခေတ် ဥရောပစတိုင် ဓာတ်ပုံလှလှ ရိုက်ကူးနိုင်ခြင်း",
            "ဘုရားကျောင်းရှေ့ရှိ လူငယ်များ စုဝေးရာ ကော်ဖီနှင့် လက်ဖက်ရည်ဆိုင်များ"
          ]
        }
      ]
    },
    hochiminh: {
      id: "hochiminh",
      countryId: "vietnam",
      name: "Ho Chi Minh City",
      heroImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
      tagline: "Dynamic Metropolis of Saigon, Bustling Markets & French Elegance",
      places: [
        {
          id: "hcm_benthanh",
          name: "Ben Thanh Market",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Shopping & Market",
          isMustVisit: true,
          popularity: 96,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
          location: "District 1, Ho Chi Minh City",
          myanmarDesc: "ဟိုချီမင်း (ဆိုင်ဂုံ) မြို့၏ အထင်ကရ အမှတ်အသားတစ်ခုဖြစ်သော ဘန်သန့်ဈေးသည် အမှတ်တရပစ္စည်းများ၊ ရိုးရာ အဝတ်အထည်များ၊ လတ်ဆတ်သော ကော်ဖီစေ့များ၊ အသီးအနှံများနှင့် အရသာရှိသော လမ်းဘေးအစားအစာများကို တစ်နေရာတည်းတွင် စုံလင်စွာ ဝယ်ယူစားသောက်နိုင်သော သမိုင်းဝင် ဈေးကြီးဖြစ်ပါသည်။",
          myanmarHighlights: [
            "ဗီယက်နမ် ကော်ဖီစစ်စစ်များနှင့် ဒေသထွက် လက်ဆောင်ပစ္စည်းများ ဝယ်ယူရန် အသင့်တော်ဆုံး",
            "ညနေ ၆ နာရီကျော်တွင် ဈေးပတ်လည်၌ စည်ကားလှသော ညဈေးတန်း (Night Market) ဖွင့်လှစ်ခြင်း"
          ]
        },
        {
          id: "hcm_warmuseum",
          name: "War Remnants Museum",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit History & Museum",
          isMustVisit: true,
          popularity: 94,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
          location: "28 Vo Van Tan, District 3, HCMC",
          myanmarDesc: "ဗီယက်နမ်စစ်ပွဲ၏ သမိုင်းကြောင်း၊ နိုင်ငံတကာ သတင်းထောက်များ၏ ဓာတ်ပုံမှတ်တမ်းများနှင့် စစ်လေယာဉ်၊ တင့်ကားများကို ခင်းကျင်းပြသထားသော အလွန်ထင်ရှားသည့် ပြတိုက်ကြီးဖြစ်ပြီး နိုင်ငံတကာ ခရီးသွားများ မဖြစ်မနေ လာရောက်လေ့လာကြသော သမိုင်းဝင် နေရာဖြစ်ပါသည်။",
          myanmarHighlights: [
            "ဗီယက်နမ်နိုင်ငံ၏ ခေတ်သစ်သမိုင်းကြောင်းကို ထဲထဲဝင်ဝင် သိရှိနိုင်ခြင်း",
            "စစ်လေယာဉ်များနှင့် လက်နက်ပစ္စည်း အစစ်အမှန်များကို အနီးကပ် တွေ့မြင်နိုင်ခြင်း"
          ]
        },
        {
          id: "hcm_banhmi",
          name: "Banh Mi Huynh Hoa (Legendary Saigon Sandwich)",
          category: "food",
          categoryLabel: "🥖 Famous Street Food",
          isMustVisit: true,
          popularity: 95,
          durationHours: 1.0,
          durationText: "1.0 Hour",
          imageUrl: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=800&q=80",
          location: "26 Le Thi Rieng, District 1, HCMC",
          myanmarDesc: "ဆိုင်ဂုံမြို့၏ အကောင်းဆုံးနှင့် အကျော်ကြားဆုံး ပေါင်မုန့်ညှပ် (Bánh Mì) ဆိုင်ဖြစ်ပါသည်။ အပြင်ယံ ကြွပ်ရွနေသော ပေါင်မုန့်အတွင်း အရည်အသွေးမြင့် ဝက်ပေါင်ခြောက်မျိုးစုံ၊ အသည်းပိတ်၊ ထောပတ်မွှေးမွှေးနှင့် ဟင်းသီးဟင်းရွက် အချဉ်များ အပြည့်ထည့်သွင်းထားသဖြင့် အရသာ အလွန်ပြည့်စုံ ကောင်းမွန်လှပါသည်။",
          myanmarHighlights: [
            "အစာသွပ် အလွန်များပြားပြီး ဗီယက်နမ်တွင် လူကြိုက်အများဆုံး ပေါင်မုန့်ဆိုင်",
            "ဆိုင်ဂုံမြို့ရောက်လျှင် လက်မလွတ်သင့်သော ဒေသစာ မုန့်ညှပ်"
          ]
        },
        {
          id: "hcm_cuchi",
          name: "Cu Chi Tunnels Excursion",
          category: "culture",
          categoryLabel: "🏛️ Historic Underground Network",
          isMustVisit: false,
          popularity: 91,
          durationHours: 4.5,
          durationText: "Half Day (4.5 Hours)",
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
          location: "Cu Chi District, Greater Saigon",
          myanmarDesc: "ဗီယက်နမ်စစ်ပွဲကာလအတွင်း အသုံးပြုခဲ့သော မိုင်ပေါင်း ၁၂၀ ကျော် ရှည်လျားသည့် မြေအောက်လှိုဏ်ခေါင်း ကွန်ရက်ကြီးဖြစ်ပြီး မြေအောက်ဆေးရုံများ၊ နေထိုင်ရာ အခန်းများနှင့် ထောင်ချောက်များကို လက်တွေ့ ဝင်ရောက် လေ့လာနိုင်ပါသည်။",
          myanmarHighlights: [
            "မြေအောက်လှိုဏ်ခေါင်းများအတွင်း ကိုယ်တိုင် တွားသွား လေ့လာနိုင်သော အတွေ့အကြုံ",
            "စစ်ပွဲကာလ ဒေသခံတို့၏ ရှင်သန်နေထိုင်မှု နည်းစနစ်များကို မြင်တွေ့နိုင်ခြင်း"
          ]
        }
      ]
    },
    singapore_city: {
      id: "singapore_city",
      countryId: "singapore",
      name: "Singapore",
      heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      tagline: "Garden City Wonders, Futuristic Domes & World-Class Attractions",
      places: [
        {
          id: "sg_gardens",
          name: "Gardens by the Bay & Supertree Grove",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Top Pick",
          isMustVisit: true,
          popularity: 99,
          durationHours: 4.0,
          durationText: "4.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
          location: "18 Marina Gardens Dr, Singapore",
          myanmarDesc: "ကမ္ဘာကျော် မိုးမျှော်သစ်ပင်ကြီးများ (Supertrees)၊ Flower Dome နှင့် Cloud Forest မှန်လုံအိမ်ကြီးများ ပါဝင်သော အနာဂတ်ဆန်သည့် ရုက္ခဗေဒဥယျာဉ်ကြီးဖြစ်ပြီး ညဘက်တွင် Garden Rhapsody အလင်းရောင်နှင့် တေးဂီတရှိုးကို အခမဲ့ ကြည့်ရှုနိုင်ပါသည်။",
          myanmarHighlights: [
            "Cloud Forest အတွင်းရှိ ဧရာမ မိုးလုံလေလုံ ရေတံခွန်ကြီးကို လေ့လာနိုင်ခြင်း",
            "ည ၇:၄၅ နှင့် ၈:၄၅ တွင် ပြုလုပ်သော အလင်းရောင်ရှိုးပွဲကို ကြည့်ရှုနိုင်ခြင်း"
          ]
        },
        {
          id: "sg_mbs",
          name: "Marina Bay Sands SkyPark & Merlion Park",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit City Landmark",
          isMustVisit: true,
          popularity: 97,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
          location: "10 Bayfront Ave, Singapore",
          myanmarDesc: "စင်ကာပူနိုင်ငံ၏ အထင်ရှားဆုံး အမှတ်အသားဖြစ်သော ခြင်္သေ့ငါးရုပ်တု (Merlion) နှင့် ၅၇ ထပ်မြောက် SkyPark ပေါ်မှ မာရီနာပင်လယ်အော်နှင့် မြို့ပြအလှကို ၃၆၀ ဒီဂရီ ရှုမျှော်ခံစားနိုင်ပါသည်။",
          myanmarHighlights: [
            "စင်ကာပူမြို့၏ အထင်ကရ Merlion Park ရှေ့တွင် အမှတ်တရ ဓာတ်ပုံရိုက်ခြင်း",
            "SkyPark ပေါ်မှ စင်ကာပူရေလက်ကြားနှင့် သင်္ဘောကြီးများ မြင်ကွင်းကျယ် ကြည့်ရှုနိုင်ခြင်း"
          ]
        },
        {
          id: "sg_laupasat",
          name: "Lau Pa Sat Hawker Center & Satay Street",
          category: "food",
          categoryLabel: "🍢 Famous Satay & Street Food",
          isMustVisit: true,
          popularity: 93,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          location: "18 Raffles Quay, Singapore",
          myanmarDesc: "ဗစ်တိုးရီးယားခေတ် ဗိသုကာလက်ရာဖြင့် တည်ဆောက်ထားသော သမိုင်းဝင် စားသောက်တန်းဖြစ်ပြီး ညနေ ၇ နာရီတွင် လမ်းပိတ်ဖွင့်လှစ်သော Satay Street တွင် မီးသွေးကင် စာတေးနှင့် စင်ကာပူ ရိုးရာ ဟော့ကာ အစားအစာများကို မြည်းစမ်းနိုင်ပါသည်။",
          myanmarHighlights: [
            "မီးသွေးဖြင့် အမွှေးကင်ထားသော ကြက်သား၊ အမဲသား၊ ပုစွန် စာတေးချောင်းများ",
            "Hainanese Chicken Rice နှင့် Laksa ခေါက်ဆွဲများ စုံလင်စွာ ရရှိနိုင်ခြင်း"
          ]
        },
        {
          id: "sg_sentosa",
          name: "Sentosa Island & Universal Studios",
          category: "must_visit",
          categoryLabel: "⭐ World-Class Theme Park",
          isMustVisit: false,
          popularity: 96,
          durationHours: 6.0,
          durationText: "Full Day (6.0 Hours)",
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
          location: "Sentosa Island, Singapore",
          myanmarDesc: "အာရှ၏ အကောင်းဆုံး အပန်းဖြေကျွန်းဖြစ်ပြီး Universal Studios Singapore ရုပ်ရှင်အခြေပြု ကစားကွင်း၊ S.E.A. Aquarium ဧရာမ ငါးပြတိုက်ကြီးနှင့် Siloso သဲသောင်ကမ်းခြေများ ပါဝင်ပါသည်။",
          myanmarHighlights: [
            "Universal Studios ရှိ Transformers နှင့် Battlestar Galactica ရိုလာကိုစတာများ",
            "ကမ္ဘာ့အကြီးဆုံး ငါးပြတိုက်များထဲမှ တစ်ခုဖြစ်သော S.E.A. Aquarium"
          ]
        }
      ]
    },
    kualalumpur: {
      id: "kualalumpur",
      countryId: "malaysia",
      name: "Kuala Lumpur",
      heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      tagline: "Petronas Twin Towers, Batu Caves & Bustling Night Markets",
      places: [
        {
          id: "kl_petronas",
          name: "Petronas Twin Towers & KLCC Park",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Global Icon",
          isMustVisit: true,
          popularity: 99,
          durationHours: 2.5,
          durationText: "2.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
          location: "Kuala Lumpur City Centre",
          myanmarDesc: "ကမ္ဘာကျော် ၈၈ ထပ် မိုးမျှော် အမြွှာမျှော်စင်ကြီးဖြစ်ပြီး မြေပြင်အထက် မီတာ ၁၇၀ ရှိ Skybridge တံတားနှင့် Observation Deck ပေါ်မှ ကွာလာလမ်ပူမြို့၏ ခမ်းနားသော မြင်ကွင်းကျယ်ကို ကြည့်ရှုနိုင်ပါသည်။",
          myanmarHighlights: [
            "ကမ္ဘာ့အမြင့်ဆုံး အမြွှာတာဝါကြီး၏ အလှကို နေ့ဘက်ရော ညဘက်ပါ ခံစားနိုင်ခြင်း",
            "Suria KLCC ကုန်တိုက်ကြီးတွင် နိုင်ငံတကာ အမှတ်တံဆိပ်များ စုံလင်စွာ ဈေးဝယ်နိုင်ခြင်း"
          ]
        },
        {
          id: "kl_batucaves",
          name: "Batu Caves & Murugan Statue",
          category: "must_visit",
          categoryLabel: "⭐ Must-Visit Heritage & Temple",
          isMustVisit: true,
          popularity: 96,
          durationHours: 3.5,
          durationText: "3.5 Hours",
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
          location: "Gombak, 13km North of KL",
          myanmarDesc: "နှစ်သန်းပေါင်း ၄၀၀ ကျော် သက်တမ်းရှိသော သဘာဝ ထုံးကျောက်ဂူကြီးများအတွင်း တည်ရှိသည့် ဟိန္ဒူဘုရားကျောင်းဖြစ်ပြီး ဧရာမ ရွှေရောင် မုရုဂန် နတ်ဘုရားရုပ်တုကြီးနှင့် ရောင်စုံဆေးခြယ်ထားသော လှေကားထစ်ပေါင်း ၂၇၂ ထစ်ကို တက်ရောက် လေ့လာနိုင်ပါသည်။",
          myanmarHighlights: [
            "ကမ္ဘာ့အမြင့်ဆုံး ရွှေရောင် မုရုဂန် ရုပ်တုကြီးရှေ့တွင် ဓာတ်ပုံရိုက်ကူးနိုင်ခြင်း",
            "သဘာဝ ဂူကြီးအတွင်းရှိ ထုံးကျောက် ရုပ်ကြွများနှင့် ဘုရားကျောင်း ဗိသုကာများ"
          ]
        },
        {
          id: "kl_jalanalor",
          name: "Jalan Alor Street Food Night Market",
          category: "food",
          categoryLabel: "🍜 Famous Food & Night Market",
          isMustVisit: true,
          popularity: 94,
          durationHours: 2.0,
          durationText: "2.0 Hours",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          location: "Bukit Bintang, Kuala Lumpur",
          myanmarDesc: "မလေးရှားနိုင်ငံ၏ အစည်ကားဆုံး လမ်းဘေးညဈေးတန်းဖြစ်ပြီး မလေး၊ တရုတ်၊ အိန္ဒိယ ရိုးရာအစားအစာမျိုးစုံ၊ စာတေး (Satay)၊ ဒူးရင်းသီး၊ ကင်ထားသော ကြက်တောင်ပံနှင့် လတ်ဆတ်သော ပင်လယ်စာများကို စုံလင်စွာ မြည်းစမ်းနိုင်ပါသည်။",
          myanmarHighlights: [
            "Wong Ah Wah ဆိုင်၏ ကမ္ဘာကျော် BBQ ကြက်တောင်ပံကင် မဖြစ်မနေ စားသုံးနိုင်ခြင်း",
            "Bukit Bintang ဈေးဝယ်ဧရိယာနှင့် ကပ်လျက်ရှိသဖြင့် ညဘက် လည်ပတ်ရန် အကောင်းဆုံး"
          ]
        }
      ]
    }
  }
};
