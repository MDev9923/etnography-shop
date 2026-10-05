export type Language = 'en' | 'mk';
export type Currency = 'EUR' | 'MKD';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      about: 'About',
      contact: 'Contact'
    },
    home: {
      title: 'Etnography - Professional Photography Equipment',
      subtitle: 'Discover premium analog and digital cameras, lenses, and accessories for professional and amateur photographers.',
      featured: 'Featured Products',
      viewAll: 'View All Products',
      shopNow: 'Shop Now'
    },
    catalog: {
      title: 'Product Catalog',
      filters: 'Filters',
      sortBy: 'Sort by',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      newest: 'Newest First',
      oldest: 'Oldest First',
      noProducts: 'No products found matching your criteria.',
      clearFilters: 'Clear Filters',
      filterBy: {
        brand: 'Brand',
        category: 'Category',
        type: 'Type',
        filmType: 'Film Type',
        mount: 'Mount',
        condition: 'Condition',
        priceRange: 'Price Range'
      },
      categories: {
        camera: 'Cameras',
        lens: 'Lenses',
        accessory: 'Accessories',
        camcorder: 'Camcorders',
        film: 'Film'
      },
      types: {
        film: 'Film',
        digital: 'Digital',
        both: 'Both'
      },
     filmTypes: {
        mm35: '35mm',
        mm120: '120',
        mm35Color: '35mm Color',
        mm35BW: '35mm Black & White',
        mm120Color: '120 Color',
        mm120BW: '120 Black & White',
        aps: 'APS',
        mm110: '110',
        mm110Color: '110 Color',
        mm110BW: '110 Black & White',
        polaroidSX70: 'Polaroid SX-70',
        polaroid600: 'Polaroid 600',
        polaroidIType: 'Polaroid i-Type',
        instaxMini: 'Instax Mini',
        instaxSquare: 'Instax Square',
        instaxWide: 'Instax Wide',
        xiaomiZink: 'Xiaomi ZINK Paper',
      },
      conditions: {
        likeNew: 'Like New',
        excellent: 'Excellent',
        veryGood: 'Very Good',
        good: 'Good',
        low: 'Low'
      }
    },
    product: {
      specifications: 'Specifications',
      condition: 'Condition',
      addToCart: 'DM to Buy',
      shareProduct: 'Share this product',
      relatedProducts: 'Related Products',
      gallery: 'Gallery',
      description: 'Description'
    },
    about: {
      title: 'About Us',
      description: 'We are passionate about photography and dedicated to providing the finest selection of cameras, lenses, and accessories for both professional and amateur photographers.',
      mission: 'Our Mission',
      missionText: 'To make quality photography equipment accessible to everyone while preserving the art and craft of photography.',
      expertise: 'Our Expertise',
      expertiseText: 'With over 15 years of experience in photography equipment, we carefully curate each item in our collection.',
      qualityAssurance: 'Quality Assurance',
      qualityAssuranceText: 'Every item in our inventory undergoes rigorous testing and inspection to ensure it meets our high standards of quality and performance.',
      ourStory: 'Our Story',
      storyPart1: 'Founded in 2008, Etnography began as a small passion project by a group of photography enthusiasts who wanted to make quality camera equipment accessible to everyone in Macedonia.',
      storyPart2: 'Over the years, we\'ve grown from a small local shop to a trusted destination for photographers across the region, known for our carefully curated selection, expert advice, and exceptional customer service.',
      storyPart3: 'Today, we continue to serve both professional photographers and hobbyists, offering everything from vintage film cameras to the latest digital equipment, all backed by our commitment to quality and customer satisfaction.',
      yearsExperience: 'Years Experience',
      happyCustomers: 'Happy Customers',
      productsSold: 'Products Sold',
      brandsAvailable: 'Brands Available'
    },
    contact: {
      title: 'Contact Us',
      description: 'Get in touch with us for any questions about our products or services.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      instagram: 'Instagram',
      phone: 'Phone',
      emailLabel: 'Email',
      address: 'Address',
      hours: 'Business Hours'
    },
    footer: {
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Info'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      search: 'Search products...',
      language: 'Language',
      currency: 'Currency',
      price: 'Price',
      brand: 'Brand',
      category: 'Category',
      viewDetails: 'View Details',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      apply: 'Apply',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      noResults: 'No products found',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      page: 'Page',
      of: 'of',
      items: 'items',
      showing: 'Showing',
      to: 'to',
      sortBy: 'Sort by',
      relevance: 'Relevance',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      newest: 'Newest',
      oldest: 'Oldest',
      clear: 'Clear'
    },
  },
  mk: {
    nav: {
      home: 'Почетна',
      catalog: 'Каталог',
      about: 'За нас',
      contact: 'Контакт'
    },
    home: {
      title: 'Etnography - Професионална фотографска опрема',
      subtitle: 'Откријте премиум аналогни и дигитални фотоапарати, објективи и додатоци за професионални и аматерски фотографи.',
      featured: 'Проминирани производи',
      viewAll: 'Види сите производи',
      shopNow: 'Купи сега'
    },
    catalog: {
      title: 'Каталог на производи',
      filters: 'Филтри',
      sortBy: 'Подреди по',
      priceLowHigh: 'Цена: Ниска кон Висока',
      priceHighLow: 'Цена: Висока кон Ниска',
      newest: 'Најнови прво',
      oldest: 'Најстари прво',
      noProducts: 'Не се пронајдени производи што одговараат на вашите критериуми.',
      clearFilters: 'Исчисти Филтри',
      filterBy: {
        brand: 'Бренд',
        category: 'Категорија',
        type: 'Тип',
        filmType: 'Тип на филм',
        mount: 'Монт',
        condition: 'Состојба',
        priceRange: 'Ценовен Ранг'
      },
      categories: {
        camera: 'Фотоапарати',
        lens: 'Објективи',
        accessory: 'Додатоци',
        camcorder: 'Камкордери',
        film: 'Филм'
      },
      types: {
        film: 'Филм',
        digital: 'Дигитално',
        both: 'Двете'
      },
      filmTypes: {
        mm35Color: '35mm во боја',
        mm35BW: '35mm црно-бело',
        mm120Color: '120 во боја',
        mm120BW: '120 црно-бело'
      },
      conditions: {
        likeNew: 'Како Ново',
        excellent: 'Одлично',
        veryGood: 'Многу Добро',
        good: 'Добро',
        low: 'Слабо'
      }
    },
    product: {
      specifications: 'Спецификации',
      condition: 'Состојба',
      addToCart: 'Порака за Купување',
      shareProduct: 'Сподели го овој производ',
      relatedProducts: 'Поврзани Производи',
      gallery: 'Галерија',
      description: 'Опис'
    },
    about: {
      title: 'За Нас',
      description: 'Страствени сме за фотографија и посветени на обезбедување на најдобриот избор на фотоапарати, обективи и додатоци за професионални и аматерски фотографи.',
      mission: 'Наша Мисија',
      missionText: 'Да направиме квалитетна фотографска опрема достапна за сите додека го зачувуваме уметноста и занаетот на фотографијата.',
      expertise: 'Нашето Знаење',
      expertiseText: 'Со над 15 години искуство во фотографска опрема, внимателно курираме секој предмет во нашата колекција.',
      qualityAssurance: 'Гаранција на Квалитет',
      qualityAssuranceText: 'Секој предмет во нашата инвентура поминува низ строги тестови и инспекции за да се осигура дека ги исполнува нашите високи стандарди за квалитет и перформанс.',
      ourStory: 'Нашата Приказна',
      storyPart1: 'Основана во 2008 година, Etnography започна како мал проект од група љубители на фотографија кои сакаа да го направат квалитетното фото опрема достапно за сите во Македонија.',
      storyPart2: 'Over the years, we\'ve grown from a small local shop to a trusted destination for photographers across the region, known for our carefully curated selection, expert advice, and exceptional customer service.',
      storyPart3: 'Today, we continue to serve both professional photographers and hobbyists, offering everything from vintage film cameras to the latest digital equipment, all backed by our commitment to quality and customer satisfaction.',
      yearsExperience: 'Години Искуство',
      happyCustomers: 'Задоволни Клиенти',
      productsSold: 'Продадени Производи',
      brandsAvailable: 'Достапни Брендови'
    },
    contact: {
      title: 'Контактирајте не',
      description: 'Контактирајте не за какви било прашања за нашите производи или услуги.',
      name: 'Име',
      email: 'Е-пошта',
      message: 'Порака',
      send: 'Испрати Порака',
      instagram: 'Инстаграм',
      phone: 'Телефон',
      emailLabel: 'Е-пошта',
      address: 'Адреса',
      hours: 'Работно Време'
    },
    footer: {
      quickLinks: 'Брзи Врски',
      contactInfo: 'Контакт Информации'
    },
    common: {
      loading: 'Вчитување...',
      error: 'Се појави грешка',
      search: 'Пребарај производи...',
      language: 'Јазик',
      currency: 'Валута',
      price: 'Цена',
      brand: 'Бренд',
      category: 'Категорија',
      viewDetails: 'Види Детали',
      back: 'Назад',
      next: 'Следно',
      previous: 'Претходно',
      close: 'Затвори',
      apply: 'Примени',
      cancel: 'Откажи',
      save: 'Зачувај',
      edit: 'Уреди',
      delete: 'Избриши',
      confirm: 'Потврди',
      yes: 'Да',
      no: 'Не',
      noResults: 'Не се пронајдени производи',
      addToCart: 'Додај во кошничка',
      outOfStock: 'Нема на залиха',
      inStock: 'Достапно',
      page: 'Страница',
      of: 'од',
      items: 'предмети',
      showing: 'Прикажување',
      to: 'до',
      sortBy: 'Подреди по',
      relevance: 'Релевантност',
      priceLowHigh: 'Цена: Ниска до висока',
      priceHighLow: 'Цена: Висока до ниска',
      newest: 'Најново',
      oldest: 'Најстаро',
      clear: 'Исчисти'
    }
  }
};

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang];
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}
