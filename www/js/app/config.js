/*global module, require*/

module.exports = {
    fs: void 0
    , appName: 'Sada'
    , track: true
    , trackId: 'UA-31877-21'
    , folder: 'com.ceip.sada'
    , storyFontSize: 1.0
    , connectionMessage: 'No network connection detected'
    , menuMessage: 'Not yet downloaded'
    , missingImage: 'http://carnegieendowment.org/app-img-not-avail.png'
    , missingImageRef: void 0
    , menu: [{
        title: 'Now from Sada'
        , sub: 'Read Offline'
        , feeds: [{
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppSadaEn'
            , name: 'Update Posts'
            , filename: 'sada-en.json'
            , type: 'json'
            , required: true
        }]
    }, {
        title: 'الآن في صدى'
        , sub: 'إقرأ بلا اتصال'
        , dir: 'rtl'
        , feeds: [{
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppSadaAr'
            , name: 'تحديث الكل '
            , filename: 'sada-ar.json'
            , dir: 'rtl'
            , type: 'json'
            , arabic: true
        }]
    }, {
        title: 'Browse Topics'
        , links: [{
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=727&type=topic'
            , name: 'Civil Society'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=729&type=topic'
            , name: 'Economic Reform'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=731&type=topic'
            , name: 'Educational Reform'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=733&type=topic'
            , name: 'Freedom of Expression'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=725&type=topic'
            , name: 'Human Rights'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=735&type=topic'
            , name: 'Islamist Politics'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=757&type=topic'
            , name: 'Opposition Politics'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=737&type=topic'
            , name: 'Political Reforms'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1215&type=topic'
            , name: 'Identity Politics'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1214&type=topic'
            , name: 'Security Issues'
        }]
    }, {
        title: 'Browse Regions'
        , links: [{
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=692&type=region'
            , name: 'Gulf Countries'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=696&type=region'
            , name: 'Bahrain'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1470&type=region'
            , name: 'Iran'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=700&type=region'
                , name: 'Kuwait'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=704&type=region'
            , name: 'Oman'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=708&type=region'
            , name: 'Qatar'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=712&type=region'
            , name: 'Saudi Arabia'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=716&type=region'
            , name: 'United Arab Emirates'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=720&type=region'
            , name: 'Yemen'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=668&type=region'
            , name: 'Levant'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=672&type=region'
            , name: 'Iraq'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=680&type=region'
            , name: 'Jordan'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=676&type=region'
            , name: 'Lebanon'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=684&type=region'
            , name: 'Palestine'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=688&type=region'
            , name: 'Syria'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1472&type=region'
            , name: 'Turkey'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=636&type=region'
            , name: 'North Africa'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=652&type=region'
            , name: 'Algeria'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=644&type=region'
            , name: 'Egypt'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=648&type=region'
            , name: 'Libya'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=656&type=region'
            , name: 'Mauritania'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=660&type=region'
            , name: 'Morocco'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=640&type=region'
            , name: 'Sudan'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=664&type=region'
            , name: 'Tunisia'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=744&type=region'
            , name: 'General'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=743&type=region'
            , name: 'Middle East'
        }]
    }, {
        title: 'Browse Topics'
        , links: [{
            url: 'http://carnegieendowment.org/sada/?fa=aboutSada'
            , name: 'About Sada'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=contributors'
            , name: 'Contributors'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=series'
            , name: 'Spotlight'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=debate'
            , name: 'Debates'
        }, {
            url: 'http://carnegieendowment.org/sada/2011/10/24/beyond-sada/aobz'
            , name: 'Beyond Sada'
        }, {
            url: 'http://carnegieendowment.org/sada/index.cfm?fa=show&article=45818&lang=en'
            , name: 'Reform Blogs'
        }]
    }, {
        title: 'استعرض المواضيع'
        , dir: 'rtl'
        , links: [{
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=728&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'المجتمع المدني '
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=736&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'السياسة الإسلامية '
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=738&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'الإصلاح السياسي '
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=730&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'الإصلاح الاقتصادي '
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=732&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'إصلاح التعليم'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1328&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'سياسة الهوية'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=1330&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'المسائل الأمنية'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=726&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'حقوق الإنسان '
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=734&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'حرية التعبير'
        }, {
            url: 'http://carnegieendowment.org/sada/?fa=showCategory&id=758&type=topic&lang=ar'
            , dir: 'rtl'
            , name: 'المعارضة '
        }]
    }, {
        title: 'استعرض الأقاليم'
        , dir: 'rtl'
        , links: [{
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=693&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الخليج العربي'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=1471&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'إيران'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=717&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الإمارات'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=697&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'البحرين'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=701&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الكويت'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=713&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'المملكة العربية السعودية'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=721&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'اليمن'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=705&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'عمان'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=709&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'قطر'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=637&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'شمال إفريقيا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=653&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الجزائر'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=641&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'السودان'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=661&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'المغرب'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=665&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'تونس'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=649&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'ليبيا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=645&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'مصر'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=657&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'موريتانيا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=669&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'المشرق العربي'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=681&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الأردن'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=673&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'العراق'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=1473&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'تركيا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=689&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'سوريا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=685&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'فلسطين'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=677&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'لبنان'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=745&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'عام'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=showCategory&id=747&type=region&lang=ar'
            , dir: 'rtl'
            , name: 'الشرق الأوسط'
        }]
    }, {
        title: 'ابحث'
        , dir: 'rtl'
        , links: [{
            url:'http://carnegieendowment.org/sada/?fa=aboutSada&lang=ar'
            , dir: 'rtl'
            , name: 'عن صدى'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=contributors&lang=ar'
            , dir: 'rtl'
            , name: 'كتّابنا'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=series&lang=ar'
            , dir: 'rtl'
            , name: 'موضوع الشهر'
        }, {
            url:'http://carnegieendowment.org/sada/?fa=debate&lang=ar'
            , dir: 'rtl'
            , name: 'نقاشات'
        }, {
            url:'http://carnegieendowment.org/sada%2F2011%2F10%2F26%2F%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA-%D8%A3%D8%AE%D8%B1%D9%89%2F6e15'
            , dir: 'rtl'
            , name: 'مقالات أخرى'
        }, {
            url:'http://carnegieendowment.org/sada/index.cfm?fa=show&article=45819&lang=ar'
            , dir: 'rtl'
            , name: 'بوابة المدونيين '
        }]
    }]
};