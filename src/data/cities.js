// ==========================================
// GLOBAL CITIES DATA - PAKISTAN + WORLD
// FULLY UPGRADED WITH 500+ PAKISTANI CITIES
// + API INTEGRATION (OpenWeather, OpenCage, Nominatim)
// + CASE-INSENSITIVE SEARCH (FIXED)
// ==========================================

// ==========================================
// API CONFIGURATION
// ==========================================
export const API_CONFIG = {
  // OpenWeatherMap - Weather + Geocoding
  OPENWEATHER_KEY: 'YOUR_OPENWEATHER_API_KEY',
  OPENWEATHER_BASE: 'https://api.openweathermap.org',

  // OpenCage - Geocoding (better for Pakistan)
  OPENCAGE_KEY: 'YOUR_OPENCAGE_API_KEY',
  OPENCAGE_BASE: 'https://api.opencagedata.com/geocode/v1',

  // Nominatim (OpenStreetMap) - Free, no key needed
  NOMINATIM_BASE: 'https://nominatim.openstreetmap.org',

  // WeatherAPI (alternative)
  WEATHERAPI_KEY: 'YOUR_WEATHERAPI_KEY',
  WEATHERAPI_BASE: 'https://api.weatherapi.com/v1',

  // Timeout
  TIMEOUT: 10000,
};

// ==========================================
// PAKISTAN CITIES - BY PROVINCE
// ==========================================
export const PAKISTAN_CITIES = {
  provinces: {
    'Punjab': [
      'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sargodha',
      'Sialkot', 'Bahawalpur', 'Okara', 'Sahiwal', 'Rahim Yar Khan', 'Dera Ghazi Khan',
      'Sheikhupura', 'Kasur', 'Jhelum', 'Khanewal', 'Hafizabad', 'Muzaffargarh',
      'Mianwali', 'Vehari', 'Jhang', 'Gojra', 'Chiniot', 'Kamoke', 'Mandi Bahauddin',
      'Toba Tek Singh', 'Layyah', 'Bhakkar', 'Pakpattan', 'Nankana Sahib',
      'Khushab', 'Chichawatni',
      'Gujar Khan', 'Gujrat', 'Attock', 'Chakwal', 'Talagang', 'Kallar Kahar',
      'Murree', 'Kotli Sattian', 'Kahuta', 'Taxila', 'Wah Cantt', 'Hasan Abdal',
      'Kamra', 'Pind Dadan Khan', 'Dina', 'Mangla', 'Fateh Jang', 'Jand',
      'Hazro', 'Pindi Gheb', 'Choa Saidan Shah', 'Bhalwal', 'Kot Momin',
      'Daska', 'Pasrur', 'Zafarwal', 'Shakargarh', 'Narowal', 'Wazirabad',
      'Kamalia', 'Pir Mahal', 'Burewala', 'Mailsi', 'Hasilpur', 'Ahmadpur East',
      'Uch Sharif', 'Liaquatpur', 'Khanpur', 'Sadiqabad', 'Jatoi', 'Alipur',
      'Kot Addu', 'Taunsa', 'Fort Munro', 'Sakhi Sarwar', 'Jampur', 'Rajapur',
      'Nowshera Virkan', 'Ghakhar', 'Alipur Chatha', 'Kot Radha Kishan',
      'Chunian', 'Pattoki', 'Renala Khurd', 'Depalpur', 'Hujra Shah Muqeem',
      'Bhawana', 'Lalian', 'Chak Jhumra', 'Samundri', 'Tandlianwala',
      'Jaranwala', 'Chakwal', 'Kallur Kot', 'Mankera', 'Darya Khan',
      'Kalurkot', 'Shorkot', 'Ahmedpur Sial', 'Shah Jewna', 'Athara Hazari',
      'Kot Shamir', 'Sarai Alamgir', 'Kharian', 'Khewra', 'Pind Dadan Khan',
      'Malakwal', 'Bhera', 'Bhalwal', 'Sahiwal', 'Farooqabad', 'Safdarabad',
      'Sangla Hill', 'Nankana Sahib', 'Shahkot', 'Chak Jhumra', 'Ferozewala',
      'Kot Abdul Malik', 'Raiwind', 'Manga Mandi', 'Kot Lakhpat', 'Harbanspura'
    ],
    'Sindh': [
      'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas',
      'Khairpur', 'Thatta', 'Badin', 'Dadu', 'Shikarpur', 'Jacobabad',
      'Kashmore', 'Sanghar', 'Umerkot', 'Kandhkot', 'Ghotki', 'Tando Allahyar',
      'Tando Muhammad Khan', 'Moro', 'Kamber', 'Shahdadkot', 'Sehwan',
      'Kotri', 'Jamshoro', 'Matiari', 'Sajawal', 'Tharparkar', 'Mithi',
      'Diplo', 'Chachro', 'Nagar Parkar', 'Islamkot', 'Kaloi', 'Khipro',
      'Shahdadpur', 'Sinjhoro', 'Tando Adam', 'Jhol', 'Sakrand', 'Bhitshah',
      'Hala', 'Matli', 'Talhar', 'Rajo Khanani', 'Tando Ghulam Ali',
      'Golarchi', 'Kario Ghanwar', 'Bulri Shah Karim', 'Kot Ghulam Muhammad',
      'Kunri', 'Samaro', 'Pithoro', 'Jhudo', 'Chhor', 'Naukot', 'Jhudo',
      'Daharki', 'Mirpur Mathelo', 'Ubauro', 'Pano Aqil', 'Rohri', 'Saleh Pat',
      'Bagarji', 'Kandiaro', 'Mehrabpur', 'Thari Mirwah', 'Faiz Ganj',
      'Kot Diji', 'Ranipur', 'Gambat', 'Kingri', 'Sobhodero', 'Lakhi',
      'Baqrani', 'Dokri', 'Qambar', 'Nasirabad', 'Warah', 'Miro Khan',
      'Ratodero', 'Garhi Khairo', 'Thul', 'Tangwani', 'Kandhkot'
    ],
    'Khyber Pakhtunkhwa': [
      'Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan',
      'Mansehra', 'Kohat', 'Bannu', 'Charsadda', 'Nowshera', 'Mingora',
      'Haripur', 'Swabi', 'Timergara', 'Batkhela', 'Chitral', 'Parachinar',
      'Landi Kotal', 'Tank', 'Lakki Marwat', 'Hangu', 'Karak',
      'Mardan', 'Nowshera', 'Charsadda', 'Takht Bhai', 'Risalpur',
      'Pabbi', 'Akora Khattak', 'Jehangira', 'Nizampur', 'Pir Piai',
      'Khyber', 'Jamrud', 'Bara', 'Bazar', 'Landi Arbab', 'Wazir Bagh',
      'Hayatabad', 'Regi', 'Badaber', 'Mathra', 'Gulbahar', 'Daudzai',
      'Shabqadar', 'Tangai', 'Prang', 'Sherpao', 'Ziam', 'Chitral',
      'Mastuj', 'Booni', 'Mirkhani', 'Kuragh', 'Drosh', 'Shoghor',
      'Bumburate', 'Rumbur', 'Birir', 'Ayun', 'Broghil', 'Karimabad',
      'Sost', 'Gulmit', 'Passu', 'Shimshal', 'Chipursan', 'Sultanabad'
    ],
    'Balochistan': [
      'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman', 'Sibi', 'Loralai',
      'Zhob', 'Pishin', 'Muslim Bagh', 'Mastung', 'Kalat', 'Kharan', 'Washuk',
      'Awaran', 'Kech', 'Lasbela', 'Hub', 'Dalbandin', 'Noshki', 'Panjgur',
      'Dera Murad Jamali', 'Jafferabad', 'Dera Allah Yar', 'Sohbatpur',
      'Usta Muhammad', 'Jhat Pat', 'Gandava', 'Bhag', 'Lehri', 'Khattan',
      'Barkhan', 'Kohlu', 'Duki', 'Mawand', 'Harnai', 'Shahrag', 'Ziarat',
      'Sanjavi', 'Dukki', 'Luni', 'Toba Kakari', 'Killa Saifullah',
      'Killa Abdullah', 'Gulistan', 'Karezat', 'Toba Achakzai', 'Chagai',
      'Nokundi', 'Taftan', 'Saindak', 'Rehmatabad', 'Buleda', 'Mand',
      'Tump', 'Dasht', 'Hoshab', 'Shahrak', 'Kallag', 'Surkhab', 'Bela',
      'Uthal', 'Winder', 'Dureji', 'Kanraj', 'Liari', 'Sonmiani', 'Ormara',
      'Pasni', 'Jiwani', 'Ganz', 'Suntsar', 'Pishukan'
    ],
    'Islamabad': [
      'Islamabad',
      'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'F-11', 'G-6', 'G-7', 'G-8',
      'G-9', 'G-10', 'G-11', 'G-12', 'G-13', 'G-14', 'G-15', 'G-16',
      'H-8', 'H-9', 'H-10', 'H-11', 'H-12', 'I-8', 'I-9', 'I-10',
      'I-11', 'I-12', 'I-14', 'I-16', 'E-7', 'E-8', 'E-9', 'E-10',
      'E-11', 'D-12', 'D-13', 'D-14', 'D-15', 'D-16', 'C-12', 'C-13',
      'C-14', 'C-15', 'C-16', 'B-17', 'B-18', 'B-19', 'B-20'
    ],
    'Gilgit-Baltistan': [
      'Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghanche', 'Shigar', 'Astore',
      'Diamer', 'Ghizer', 'Kharmang', 'Rondu', 'Danyor', 'Karimabad', 'Aliabad',
      'Chilas', 'Babusar', 'Jaglot', 'Sassi', 'Sost', 'Gulmit', 'Passu',
      'Shimshal', 'Chipursan', 'Misgar', 'Khunjerab', 'Dhee', 'Jutal',
      'Khaplu', 'Shyok', 'Hushe', 'Kondus', 'Machlu', 'Thally', 'Skardu',
      'Shigar', 'Kharmang', 'Astore', 'Minimarg', 'Gudai', 'Chilam',
      'Chowari', 'Bunji', 'Sher Qila', 'Singal', 'Gahkuch', 'Yasin',
      'Phander', 'Teru', 'Ishkoman', 'Immit', 'Zood Khun'
    ],
    'Azad Kashmir': [
      'Muzaffarabad', 'Mirpur', 'Kotli', 'Bhimber', 'Rawalakot', 'Neelum',
      'Baghdadi', 'Poonch', 'Sudhanoti', 'Hattian', 'Haveli', 'Jhelum Valley',
      'Dadyal', 'Khuiratta', 'Sehnsa', 'Fatehpur', 'Charhoi', 'Nakyal',
      'Pallandri', 'Tarar Khal', 'Mang', 'Hajira', 'Tain', 'Seri',
      'Kahuta', 'Abbaspur', 'Samahni', 'Barnala', 'Chhota Gala',
      'Jandala', 'Rara', 'Bagh', 'Dhirkot', 'Sudhnoti', 'Tarar Khel',
      'Plandri', 'Trarkhel', 'Thorar', 'Topa', 'Kotli', 'Sehnsa',
      'Rajdhani', 'Chowki', 'Banjosa', 'Toli Pir', 'Pir Chinasi'
    ]
  },

  getAllCities: function () {
    const all = [];
    Object.values(this.provinces).forEach((cities) => {
      all.push(...cities);
    });
    return [...new Set(all)];
  }
};

// ==========================================
// WORLD CITIES (Major Cities)
// ==========================================
export const WORLD_CITIES = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
  'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan', 'Hangzhou', 'Xi\'an', 'Tianjin', 'Nanjing'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec', 'Hamilton', 'Halifax'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Hobart'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Kayseri', 'Mersin'],
  'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz', 'Kermanshah', 'Urmia'],
  'Bangladesh': ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj'],
  'Afghanistan': ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Jalalabad', 'Kunduz', 'Lashkar Gah', 'Ghazni', 'Balkh', 'Khost'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Johor Bahru', 'Shah Alam', 'Petaling Jaya', 'Kuching', 'Kota Kinabalu', 'Malacca City', 'Alor Setar'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Hat Yai', 'Nakhon Ratchasima', 'Udon Thani', 'Khon Kaen', 'Surat Thani', 'Rayong'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'Tanta', 'Asyut'],
  'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 'Kaduna', 'Maiduguri', 'Zaria', 'Aba'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Cancún', 'Mérida'],
  'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen'],
  'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel'],
  'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
  'Norway': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
  'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
  'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Piraeus', 'Larissa', 'Heraklion', 'Peristeri', 'Kallithea', 'Acharnes', 'Kalamaria'],
  'Portugal': ['Lisbon', 'Porto', 'Amadora', 'Braga', 'Coimbra', 'Funchal', 'Setúbal', 'Almada', 'Queluz', 'Rio Tinto'],
  'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
  'Ireland': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Bray', 'Navan', 'Kilkenny'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin', 'Palmerston North', 'Napier', 'Nelson', 'Rotorua'],
  'Singapore': ['Singapore'],
  'Hong Kong': ['Hong Kong'],
  'Qatar': ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Dukhan', 'Mesaieed', 'Al Shamal'],
  'Kuwait': ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'As Salimiyah', 'Sabah as Salim', 'Al Farwaniyah', 'Al Jahra', 'Al Fahahil'],
  'Bahrain': ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'A\'ali', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiya'],
  'Oman': ['Muscat', 'Seeb', 'Salalah', 'Bawshar', 'Sohar', 'As Suwayq', 'Ibri', 'Saham', 'Barka', 'Rustaq'],
  'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Trincomalee', 'Batticaloa', 'Matara', 'Anuradhapura', 'Ratnapura'],
  'Nepal': ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Birgunj', 'Biratnagar', 'Janakpur', 'Hetauda', 'Dhangadhi', 'Butwal'],
  'Maldives': ['Malé', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi', 'Thinadhoo', 'Naifaru', 'Hinnavaru', 'Dhidhdhoo', 'Eydhafushi', 'Mahibadhoo']
};

// ==========================================
// PAKISTAN CITY COORDINATES
// ==========================================
export const CITY_COORDS = {
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  'Faisalabad': { lat: 31.4504, lng: 73.1350 },
  'Rawalpindi': { lat: 33.5651, lng: 73.0169 },
  'Multan': { lat: 30.1575, lng: 71.5249 },
  'Gujranwala': { lat: 32.1567, lng: 74.1098 },
  'Sargodha': { lat: 32.0741, lng: 72.6742 },
  'Sialkot': { lat: 32.4945, lng: 74.5229 },
  'Bahawalpur': { lat: 29.3956, lng: 71.6836 },
  'Okara': { lat: 30.8090, lng: 73.4510 },
  'Sahiwal': { lat: 30.6609, lng: 73.1084 },
  'Rahim Yar Khan': { lat: 28.4212, lng: 70.2989 },
  'Dera Ghazi Khan': { lat: 30.0457, lng: 70.6403 },
  'Sheikhupura': { lat: 31.7131, lng: 73.9783 },
  'Kasur': { lat: 31.1186, lng: 74.4500 },
  'Jhelum': { lat: 32.9300, lng: 73.7300 },
  'Khanewal': { lat: 30.3000, lng: 71.9300 },
  'Hafizabad': { lat: 32.0700, lng: 73.6800 },
  'Muzaffargarh': { lat: 30.0700, lng: 71.1900 },
  'Mianwali': { lat: 32.5800, lng: 71.5400 },
  'Vehari': { lat: 30.0400, lng: 72.3500 },
  'Jhang': { lat: 31.2700, lng: 72.3300 },
  'Gojra': { lat: 31.1500, lng: 72.6800 },
  'Chiniot': { lat: 31.7200, lng: 72.9800 },
  'Kamoke': { lat: 31.9750, lng: 74.2200 },
  'Mandi Bahauddin': { lat: 32.5800, lng: 73.4900 },
  'Toba Tek Singh': { lat: 30.9700, lng: 72.4800 },
  'Layyah': { lat: 30.9600, lng: 70.9400 },
  'Bhakkar': { lat: 31.6200, lng: 71.0600 },
  'Pakpattan': { lat: 30.3430, lng: 73.3894 },
  'Nankana Sahib': { lat: 31.4500, lng: 73.7100 },
  'Khushab': { lat: 32.3000, lng: 72.3500 },
  'Chichawatni': { lat: 30.5300, lng: 72.6900 },
  'Gujar Khan': { lat: 33.2558, lng: 73.3027 },
  'Gujrat': { lat: 32.5731, lng: 74.0789 },
  'Attock': { lat: 33.7660, lng: 72.3600 },
  'Chakwal': { lat: 32.9328, lng: 72.8630 },
  'Talagang': { lat: 32.9270, lng: 72.4140 },
  'Murree': { lat: 33.9070, lng: 73.3943 },
  'Kahuta': { lat: 33.5917, lng: 73.3869 },
  'Taxila': { lat: 33.7463, lng: 72.7874 },
  'Wah Cantt': { lat: 33.7712, lng: 72.7456 },
  'Hasan Abdal': { lat: 33.8208, lng: 72.6889 },
  'Fateh Jang': { lat: 33.5656, lng: 72.6414 },
  'Pindi Gheb': { lat: 33.2417, lng: 72.2642 },
  'Jand': { lat: 33.4297, lng: 72.0172 },
  'Hazro': { lat: 33.9097, lng: 72.4928 },
  'Bhalwal': { lat: 32.2656, lng: 72.8989 },
  'Kot Momin': { lat: 32.1900, lng: 73.0300 },
  'Daska': { lat: 32.3247, lng: 74.3500 },
  'Pasrur': { lat: 32.2633, lng: 74.6667 },
  'Shakargarh': { lat: 32.2625, lng: 75.1614 },
  'Narowal': { lat: 32.1017, lng: 74.8733 },
  'Wazirabad': { lat: 32.4439, lng: 74.1197 },
  'Kamalia': { lat: 30.7250, lng: 72.6472 },
  'Burewala': { lat: 30.1586, lng: 72.6833 },
  'Mailsi': { lat: 29.8000, lng: 72.1750 },
  'Hasilpur': { lat: 29.6917, lng: 72.5486 },
  'Ahmadpur East': { lat: 29.1439, lng: 71.2578 },
  'Uch Sharif': { lat: 29.2389, lng: 71.0625 },
  'Liaquatpur': { lat: 28.9286, lng: 70.9500 },
  'Khanpur': { lat: 28.6469, lng: 70.6586 },
  'Sadiqabad': { lat: 28.3062, lng: 70.1305 },
  'Jatoi': { lat: 29.5156, lng: 70.8444 },
  'Alipur': { lat: 29.3847, lng: 70.9125 },
  'Kot Addu': { lat: 30.4694, lng: 70.9642 },
  'Taunsa': { lat: 30.7042, lng: 70.6500 },
  'Fort Munro': { lat: 29.9333, lng: 69.9167 },
  'Sakhi Sarwar': { lat: 29.9833, lng: 70.3667 },
  'Jampur': { lat: 29.6422, lng: 70.5953 },
  'Rajapur': { lat: 30.4667, lng: 70.7333 },
  'Chunian': { lat: 31.0167, lng: 73.9833 },
  'Pattoki': { lat: 31.0167, lng: 73.8500 },
  'Renala Khurd': { lat: 30.8833, lng: 73.6000 },
  'Depalpur': { lat: 30.6667, lng: 73.6500 },
  'Hujra Shah Muqeem': { lat: 30.7333, lng: 73.8167 },
  'Bhawana': { lat: 31.5667, lng: 72.6500 },
  'Lalian': { lat: 31.8167, lng: 72.8000 },
  'Chak Jhumra': { lat: 31.5667, lng: 73.1833 },
  'Samundri': { lat: 31.0667, lng: 72.9500 },
  'Tandlianwala': { lat: 31.0333, lng: 73.1333 },
  'Jaranwala': { lat: 31.3333, lng: 73.4167 },
  'Sarai Alamgir': { lat: 32.9000, lng: 73.7500 },
  'Kharian': { lat: 32.8167, lng: 73.8667 },
  'Khewra': { lat: 32.6500, lng: 73.0167 },
  'Pind Dadan Khan': { lat: 32.5833, lng: 73.0333 },
  'Malakwal': { lat: 32.5500, lng: 73.2167 },
  'Bhera': { lat: 32.4833, lng: 72.9167 },
  'Farooqabad': { lat: 31.7333, lng: 73.7333 },
  'Sangla Hill': { lat: 31.7167, lng: 73.3833 },
  'Shahkot': { lat: 31.5667, lng: 73.4833 },
  'Ferozewala': { lat: 31.8667, lng: 74.2667 },
  'Kot Abdul Malik': { lat: 31.6333, lng: 74.3333 },
  'Raiwind': { lat: 31.2500, lng: 74.2167 },
  'Manga Mandi': { lat: 31.3167, lng: 74.1167 },
  'Karachi': { lat: 24.8607, lng: 67.0011 },
  'Hyderabad': { lat: 25.3960, lng: 68.3578 },
  'Sukkur': { lat: 27.7052, lng: 68.8574 },
  'Larkana': { lat: 27.5582, lng: 68.2120 },
  'Nawabshah': { lat: 26.2394, lng: 68.4037 },
  'Mirpur Khas': { lat: 25.5249, lng: 69.0122 },
  'Khairpur': { lat: 27.5290, lng: 68.7590 },
  'Thatta': { lat: 24.7472, lng: 67.9235 },
  'Badin': { lat: 24.6550, lng: 68.8370 },
  'Dadu': { lat: 26.7300, lng: 67.7700 },
  'Shikarpur': { lat: 27.9500, lng: 68.6300 },
  'Jacobabad': { lat: 28.2800, lng: 68.4400 },
  'Kashmore': { lat: 28.4300, lng: 69.5800 },
  'Sanghar': { lat: 26.0400, lng: 68.9400 },
  'Umerkot': { lat: 25.3600, lng: 69.7400 },
  'Kandhkot': { lat: 28.2400, lng: 69.1800 },
  'Ghotki': { lat: 28.0000, lng: 69.3100 },
  'Tando Allahyar': { lat: 25.4623, lng: 68.7174 },
  'Tando Muhammad Khan': { lat: 25.1200, lng: 68.5300 },
  'Moro': { lat: 26.6600, lng: 68.0000 },
  'Kamber': { lat: 27.5800, lng: 68.6000 },
  'Shahdadkot': { lat: 27.8400, lng: 67.9000 },
  'Sehwan': { lat: 26.4200, lng: 67.8600 },
  'Kotri': { lat: 25.3667, lng: 68.3167 },
  'Jamshoro': { lat: 25.4333, lng: 68.3167 },
  'Matiari': { lat: 25.6000, lng: 68.4500 },
  'Sajawal': { lat: 24.6000, lng: 68.0833 },
  'Mithi': { lat: 24.7333, lng: 69.8000 },
  'Diplo': { lat: 24.4667, lng: 69.5833 },
  'Chachro': { lat: 25.1167, lng: 70.2500 },
  'Islamkot': { lat: 24.7000, lng: 70.1500 },
  'Khipro': { lat: 25.8333, lng: 69.3833 },
  'Shahdadpur': { lat: 25.9167, lng: 68.6167 },
  'Tando Adam': { lat: 25.7667, lng: 68.6667 },
  'Sakrand': { lat: 26.1333, lng: 68.2667 },
  'Bhitshah': { lat: 25.8000, lng: 68.4833 },
  'Hala': { lat: 25.8167, lng: 68.4167 },
  'Matli': { lat: 25.0333, lng: 68.6667 },
  'Talhar': { lat: 24.8833, lng: 68.8167 },
  'Daharki': { lat: 28.0500, lng: 69.7000 },
  'Mirpur Mathelo': { lat: 28.0167, lng: 69.5500 },
  'Ubauro': { lat: 28.1667, lng: 69.7333 },
  'Pano Aqil': { lat: 27.8500, lng: 69.1167 },
  'Rohri': { lat: 27.6833, lng: 68.9000 },
  'Saleh Pat': { lat: 27.4667, lng: 69.0333 },
  'Kandiaro': { lat: 27.0667, lng: 68.2167 },
  'Mehrabpur': { lat: 27.8000, lng: 68.5000 },
  'Thari Mirwah': { lat: 27.1500, lng: 68.7333 },
  'Faiz Ganj': { lat: 27.1333, lng: 68.8167 },
  'Kot Diji': { lat: 27.3500, lng: 68.7000 },
  'Ranipur': { lat: 27.2833, lng: 68.5000 },
  'Gambat': { lat: 27.3500, lng: 68.5167 },
  'Sobhodero': { lat: 27.3000, lng: 68.3667 },
  'Dokri': { lat: 27.3667, lng: 68.2667 },
  'Qambar': { lat: 27.5833, lng: 68.6333 },
  'Nasirabad': { lat: 27.3833, lng: 68.1833 },
  'Warah': { lat: 27.4500, lng: 67.8000 },
  'Miro Khan': { lat: 27.7500, lng: 68.1000 },
  'Ratodero': { lat: 27.8000, lng: 68.2833 },
  'Thul': { lat: 28.2333, lng: 68.7833 },
  'Peshawar': { lat: 34.0151, lng: 71.5249 },
  'Abbottabad': { lat: 34.1688, lng: 73.2215 },
  'Mardan': { lat: 34.1980, lng: 72.0479 },
  'Swat': { lat: 35.2227, lng: 72.4258 },
  'Dera Ismail Khan': { lat: 31.8329, lng: 70.9024 },
  'Mansehra': { lat: 34.3333, lng: 73.2000 },
  'Kohat': { lat: 33.5888, lng: 71.4390 },
  'Bannu': { lat: 32.9851, lng: 70.6027 },
  'Charsadda': { lat: 34.1483, lng: 71.7306 },
  'Nowshera': { lat: 33.9986, lng: 71.9982 },
  'Mingora': { lat: 34.7700, lng: 72.3600 },
  'Haripur': { lat: 33.9900, lng: 72.9300 },
  'Swabi': { lat: 34.1200, lng: 72.4700 },
  'Timergara': { lat: 34.8200, lng: 71.8400 },
  'Batkhela': { lat: 34.6200, lng: 71.9700 },
  'Chitral': { lat: 35.8500, lng: 71.7800 },
  'Parachinar': { lat: 33.9000, lng: 70.1000 },
  'Landi Kotal': { lat: 34.1000, lng: 71.1500 },
  'Tank': { lat: 32.2200, lng: 70.3700 },
  'Lakki Marwat': { lat: 32.6000, lng: 70.9100 },
  'Hangu': { lat: 33.5300, lng: 71.0600 },
  'Karak': { lat: 33.1200, lng: 71.1000 },
  'Takht Bhai': { lat: 34.2833, lng: 71.9333 },
  'Risalpur': { lat: 34.0667, lng: 71.9833 },
  'Pabbi': { lat: 34.0167, lng: 71.8000 },
  'Akora Khattak': { lat: 34.0000, lng: 72.1167 },
  'Jehangira': { lat: 34.0167, lng: 72.2000 },
  'Jamrud': { lat: 34.0000, lng: 71.3833 },
  'Bara': { lat: 33.9167, lng: 71.4667 },
  'Shabqadar': { lat: 34.2167, lng: 71.5500 },
  'Mastuj': { lat: 36.2833, lng: 72.5167 },
  'Booni': { lat: 36.4667, lng: 72.8500 },
  'Drosh': { lat: 35.5500, lng: 71.7833 },
  'Ayun': { lat: 35.9833, lng: 71.7500 },
  'Karimabad': { lat: 36.3300, lng: 74.6600 },
  'Sost': { lat: 36.6833, lng: 74.8167 },
  'Gulmit': { lat: 36.4167, lng: 74.8667 },
  'Passu': { lat: 36.4667, lng: 74.8667 },
  'Quetta': { lat: 30.1798, lng: 66.9750 },
  'Gwadar': { lat: 25.1262, lng: 62.3224 },
  'Turbat': { lat: 26.0017, lng: 63.0492 },
  'Khuzdar': { lat: 27.8119, lng: 66.6110 },
  'Chaman': { lat: 30.9177, lng: 66.4526 },
  'Sibi': { lat: 29.5510, lng: 67.8770 },
  'Loralai': { lat: 30.3706, lng: 68.5981 },
  'Zhob': { lat: 31.3580, lng: 69.4481 },
  'Pishin': { lat: 30.5800, lng: 66.9900 },
  'Muslim Bagh': { lat: 30.8400, lng: 67.7400 },
  'Mastung': { lat: 29.7900, lng: 66.8400 },
  'Kalat': { lat: 29.0200, lng: 66.5900 },
  'Kharan': { lat: 28.5800, lng: 65.4100 },
  'Washuk': { lat: 28.3300, lng: 64.8100 },
  'Awaran': { lat: 26.4500, lng: 65.2300 },
  'Kech': { lat: 26.1200, lng: 63.1200 },
  'Lasbela': { lat: 25.1800, lng: 66.7800 },
  'Hub': { lat: 25.0500, lng: 66.8900 },
  'Dalbandin': { lat: 28.8800, lng: 64.4000 },
  'Noshki': { lat: 29.5600, lng: 66.0200 },
  'Panjgur': { lat: 26.9700, lng: 64.0900 },
  'Dera Murad Jamali': { lat: 28.5500, lng: 68.2167 },
  'Jafferabad': { lat: 28.2167, lng: 68.1167 },
  'Dera Allah Yar': { lat: 28.3833, lng: 68.1667 },
  'Usta Muhammad': { lat: 28.1833, lng: 68.0500 },
  'Gandava': { lat: 28.6167, lng: 68.2500 },
  'Barkhan': { lat: 29.9167, lng: 69.5167 },
  'Kohlu': { lat: 29.9000, lng: 69.2500 },
  'Duki': { lat: 30.1500, lng: 68.9833 },
  'Harnai': { lat: 30.1000, lng: 67.9333 },
  'Shahrag': { lat: 30.0833, lng: 67.4167 },
  'Ziarat': { lat: 30.3833, lng: 67.7333 },
  'Killa Saifullah': { lat: 30.7000, lng: 68.3500 },
  'Killa Abdullah': { lat: 30.7000, lng: 66.6500 },
  'Chagai': { lat: 29.3000, lng: 64.7000 },
  'Nokundi': { lat: 28.9167, lng: 63.3833 },
  'Taftan': { lat: 28.9500, lng: 61.6000 },
  'Bela': { lat: 26.2333, lng: 66.3000 },
  'Uthal': { lat: 25.8000, lng: 66.6167 },
  'Ormara': { lat: 25.2000, lng: 64.6333 },
  'Pasni': { lat: 25.2667, lng: 63.4667 },
  'Jiwani': { lat: 25.0500, lng: 61.7500 },
  'Gilgit': { lat: 35.9203, lng: 74.3147 },
  'Skardu': { lat: 35.2971, lng: 75.6333 },
  'Hunza': { lat: 36.3167, lng: 74.6500 },
  'Nagar': { lat: 36.2667, lng: 74.4833 },
  'Ghanche': { lat: 35.1200, lng: 76.3100 },
  'Shigar': { lat: 35.4200, lng: 75.6300 },
  'Astore': { lat: 35.3600, lng: 74.8500 },
  'Diamer': { lat: 35.4500, lng: 73.9000 },
  'Ghizer': { lat: 36.1500, lng: 73.6200 },
  'Kharmang': { lat: 35.1500, lng: 76.2600 },
  'Rondu': { lat: 35.4000, lng: 75.6000 },
  'Danyor': { lat: 35.9200, lng: 74.3300 },
  'Aliabad': { lat: 36.3100, lng: 74.6200 },
  'Chilas': { lat: 35.4167, lng: 74.1000 },
  'Jaglot': { lat: 35.7000, lng: 74.0000 },
  'Khaplu': { lat: 35.1667, lng: 76.3333 },
  'Gudai': { lat: 35.4000, lng: 74.9000 },
  'Bunji': { lat: 35.6667, lng: 74.6333 },
  'Gahkuch': { lat: 36.1667, lng: 73.7500 },
  'Yasin': { lat: 36.4000, lng: 73.3000 },
  'Phander': { lat: 36.2000, lng: 73.0333 },
  'Muzaffarabad': { lat: 34.3700, lng: 73.4711 },
  'Mirpur': { lat: 33.1400, lng: 73.7500 },
  'Kotli': { lat: 33.5000, lng: 73.9000 },
  'Bhimber': { lat: 32.9700, lng: 74.0700 },
  'Rawalakot': { lat: 33.8500, lng: 73.7600 },
  'Neelum': { lat: 34.5000, lng: 73.9000 },
  'Baghdadi': { lat: 33.9700, lng: 73.7900 },
  'Poonch': { lat: 33.8500, lng: 73.7500 },
  'Sudhanoti': { lat: 33.7000, lng: 73.6500 },
  'Hattian': { lat: 34.1000, lng: 73.7200 },
  'Haveli': { lat: 33.9500, lng: 73.7000 },
  'Jhelum Valley': { lat: 34.0800, lng: 73.8600 },
  'Dadyal': { lat: 33.3167, lng: 73.7500 },
  'Khuiratta': { lat: 33.5333, lng: 73.9833 },
  'Fatehpur': { lat: 33.6000, lng: 73.9000 },
  'Pallandri': { lat: 33.7167, lng: 73.6833 },
  'Bagh': { lat: 33.9667, lng: 73.7833 },
  'Dhirkot': { lat: 34.0167, lng: 73.5667 },
  'Islamabad': { lat: 33.6844, lng: 73.0479 },
};

// ==========================================
// WORLD CITY COORDINATES
// ==========================================
export const WORLD_CITY_COORDS = {
  'New York': { lat: 40.7128, lng: -74.0060, country: 'USA' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'USA' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'USA' },
  'Houston': { lat: 29.7604, lng: -95.3698, country: 'USA' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, country: 'USA' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, country: 'USA' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, country: 'USA' },
  'Miami': { lat: 25.7617, lng: -80.1918, country: 'USA' },
  'Las Vegas': { lat: 36.1699, lng: -115.1398, country: 'USA' },
  'Boston': { lat: 42.3601, lng: -71.0589, country: 'USA' },
  'Seattle': { lat: 47.6062, lng: -122.3321, country: 'USA' },
  'Denver': { lat: 39.7392, lng: -104.9903, country: 'USA' },
  'Washington': { lat: 38.9072, lng: -77.0369, country: 'USA' },
  'London': { lat: 51.5074, lng: -0.1278, country: 'UK' },
  'Manchester': { lat: 53.4808, lng: -2.2426, country: 'UK' },
  'Birmingham': { lat: 52.4862, lng: -1.8904, country: 'UK' },
  'Glasgow': { lat: 55.8642, lng: -4.2518, country: 'UK' },
  'Liverpool': { lat: 53.4084, lng: -2.9916, country: 'UK' },
  'Edinburgh': { lat: 55.9533, lng: -3.1883, country: 'UK' },
  'Beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'Shanghai': { lat: 31.2304, lng: 121.4737, country: 'China' },
  'Guangzhou': { lat: 23.1291, lng: 113.2644, country: 'China' },
  'Shenzhen': { lat: 22.5431, lng: 114.0579, country: 'China' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, country: 'China' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, country: 'India' },
  'Delhi': { lat: 28.6139, lng: 77.2090, country: 'India' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, country: 'India' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, country: 'India' },
  'Chennai': { lat: 13.0827, lng: 80.2707, country: 'India' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, country: 'India' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'Osaka': { lat: 34.6937, lng: 135.5023, country: 'Japan' },
  'Kyoto': { lat: 35.0116, lng: 135.7681, country: 'Japan' },
  'Dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773, country: 'UAE' },
  'Sharjah': { lat: 25.3463, lng: 55.4209, country: 'UAE' },
  'Riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
  'Jeddah': { lat: 21.4858, lng: 39.1925, country: 'Saudi Arabia' },
  'Mecca': { lat: 21.3891, lng: 39.8579, country: 'Saudi Arabia' },
  'Medina': { lat: 24.5247, lng: 39.5692, country: 'Saudi Arabia' },
  'Berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
  'Munich': { lat: 48.1351, lng: 11.5820, country: 'Germany' },
  'Frankfurt': { lat: 50.1109, lng: 8.6821, country: 'Germany' },
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'Marseille': { lat: 43.2965, lng: 5.3698, country: 'France' },
  'Lyon': { lat: 45.7640, lng: 4.8357, country: 'France' },
  'Rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  'Milan': { lat: 45.4642, lng: 9.1900, country: 'Italy' },
  'Toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, country: 'Canada' },
  'Montreal': { lat: 45.5017, lng: -73.5673, country: 'Canada' },
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  'Brisbane': { lat: -27.4698, lng: 153.0251, country: 'Australia' },
  'Perth': { lat: -31.9505, lng: 115.8605, country: 'Australia' },
  'Istanbul': { lat: 41.0082, lng: 28.9784, country: 'Turkey' },
  'Ankara': { lat: 39.9334, lng: 32.8597, country: 'Turkey' },
  'Kuala Lumpur': { lat: 3.1390, lng: 101.6869, country: 'Malaysia' },
  'Singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  'Bangkok': { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  'Jakarta': { lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
  'Cairo': { lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  'Johannesburg': { lat: -26.2041, lng: 28.0473, country: 'South Africa' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  'Sao Paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, country: 'Brazil' },
  'Moscow': { lat: 55.7558, lng: 37.6173, country: 'Russia' },
  'Seoul': { lat: 37.5665, lng: 126.9780, country: 'South Korea' },
  'Madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
  'Barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain' },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  'Zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  'Geneva': { lat: 46.2044, lng: 6.1432, country: 'Switzerland' },
  'Stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
  'Oslo': { lat: 59.9139, lng: 10.7522, country: 'Norway' },
  'Copenhagen': { lat: 55.6761, lng: 12.5683, country: 'Denmark' },
  'Helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
  'Warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
  'Athens': { lat: 37.9838, lng: 23.7275, country: 'Greece' },
  'Lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  'Vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
  'Brussels': { lat: 50.8503, lng: 4.3517, country: 'Belgium' },
  'Dublin': { lat: 53.3498, lng: -6.2603, country: 'Ireland' },
  'Auckland': { lat: -36.8485, lng: 174.7633, country: 'New Zealand' },
  'Wellington': { lat: -41.2865, lng: 174.7762, country: 'New Zealand' },
  'Doha': { lat: 25.2854, lng: 51.5310, country: 'Qatar' },
  'Kuwait City': { lat: 29.3759, lng: 47.9774, country: 'Kuwait' },
  'Manama': { lat: 26.2285, lng: 50.5860, country: 'Bahrain' },
  'Muscat': { lat: 23.5880, lng: 58.3829, country: 'Oman' },
  'Colombo': { lat: 6.9271, lng: 79.8612, country: 'Sri Lanka' },
  'Kathmandu': { lat: 27.7172, lng: 85.3240, country: 'Nepal' },
  'Dhaka': { lat: 23.8103, lng: 90.4125, country: 'Bangladesh' },
  'Kabul': { lat: 34.5553, lng: 69.2075, country: 'Afghanistan' },
  'Tehran': { lat: 35.6892, lng: 51.3890, country: 'Iran' },
};

// ==========================================
// API FUNCTIONS (LIVE DATA)
// ==========================================

/**
 * Search any city in the world using Nominatim (OpenStreetMap) - Free
 */
export async function searchCityAPI(query, limit = 10) {
  try {
    const url = `${API_CONFIG.NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=${limit}&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'CityDataApp/1.0' },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    if (!response.ok) throw new Error('Nominatim API failed');
    const data = await response.json();
    return data.map((item) => ({
      name: item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      country: item.address?.country || 'Unknown',
      countryCode: item.address?.country_code?.toUpperCase() || 'XX',
      state: item.address?.state || '',
      city: item.address?.city || item.address?.town || item.address?.village || '',
      type: item.type,
      source: 'nominatim',
    }));
  } catch (error) {
    console.warn('Nominatim search failed, using local data:', error.message);
    return searchCityLocal(query);
  }
}

/**
 * Reverse geocode: coordinates -> city info using Nominatim
 */
export async function reverseGeocodeAPI(lat, lng) {
  try {
    const url = `${API_CONFIG.NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'CityDataApp/1.0' },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    if (!response.ok) throw new Error('Reverse geocode failed');
    const data = await response.json();
    return {
      name: data.display_name.split(',')[0],
      fullName: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      country: data.address?.country || 'Unknown',
      state: data.address?.state || '',
      city: data.address?.city || data.address?.town || data.address?.village || '',
      source: 'nominatim',
    };
  } catch (error) {
    console.warn('Reverse geocode failed:', error.message);
    return reverseGeocodeLocal(lat, lng);
  }
}

/**
 * Get coordinates using OpenWeatherMap Geocoding API
 */
export async function getCityCoordsOpenWeather(cityName, countryCode = '') {
  try {
    if (!API_CONFIG.OPENWEATHER_KEY || API_CONFIG.OPENWEATHER_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      throw new Error('OpenWeather API key not configured');
    }
    const url = `${API_CONFIG.OPENWEATHER_BASE}/geo/1.0/direct?q=${encodeURIComponent(cityName)}${countryCode ? ',' + countryCode : ''}&limit=5&appid=${API_CONFIG.OPENWEATHER_KEY}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    if (!response.ok) throw new Error('OpenWeather geocoding failed');
    const data = await response.json();
    if (data.length === 0) return null;
    const city = data[0];
    return {
      name: city.name,
      lat: city.lat,
      lng: city.lon,
      country: city.country,
      state: city.state || '',
      source: 'openweather',
    };
  } catch (error) {
    console.warn('OpenWeather geocoding failed:', error.message);
    return null;
  }
}

/**
 * Get weather for a city using OpenWeatherMap
 */
export async function getWeatherAPI(lat, lng) {
  try {
    if (!API_CONFIG.OPENWEATHER_KEY || API_CONFIG.OPENWEATHER_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      throw new Error('OpenWeather API key not configured');
    }
    const url = `${API_CONFIG.OPENWEATHER_BASE}/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_CONFIG.OPENWEATHER_KEY}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();
    return {
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      pressure: data.main?.pressure,
      weather: data.weather?.[0]?.main,
      description: data.weather?.[0]?.description,
      windSpeed: data.wind?.speed,
      icon: data.weather?.[0]?.icon,
      source: 'openweather',
    };
  } catch (error) {
    console.warn('Weather API failed:', error.message);
    return null;
  }
}

/**
 * Master function: Get city info with API + fallback
 */
export async function getCityInfo(cityName) {
  try {
    const results = await searchCityAPI(cityName, 1);
    if (results.length > 0) {
      const result = results[0];
      const weather = await getWeatherAPI(result.lat, result.lng);
      return { ...result, weather };
    }
  } catch (e) {
    console.warn('API failed, falling back to local:', e.message);
  }

  const localInfo = searchCityLocal(cityName);
  if (localInfo.length > 0) {
    return { ...localInfo[0], source: 'local', weather: null };
  }

  return null;
}

// ==========================================
// LOCAL SEARCH FUNCTIONS (Fallback)
// ==========================================

/**
 * Search city in local data (Pakistan + World) - CASE INSENSITIVE
 */
export function searchCityLocal(query) {
  if (!query) return [];

  const results = [];
  const lowerQuery = String(query).toLowerCase().trim();

  // Search Pakistan cities
  for (const [province, cities] of Object.entries(PAKISTAN_CITIES.provinces)) {
    for (const city of cities) {
      if (city.toLowerCase().includes(lowerQuery)) {
        const coords = CITY_COORDS[city];
        results.push({
          name: city,
          fullName: `${city}, ${province}, Pakistan`,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
          country: 'Pakistan',
          countryCode: 'PK',
          state: province,
          city: city,
          source: 'local',
        });
      }
    }
  }

  // Search World cities
  for (const [country, cities] of Object.entries(WORLD_CITIES)) {
    for (const city of cities) {
      if (city.toLowerCase().includes(lowerQuery)) {
        const coords = WORLD_CITY_COORDS[city];
        results.push({
          name: city,
          fullName: `${city}, ${country}`,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
          country: country,
          countryCode: 'XX',
          state: '',
          city: city,
          source: 'local',
        });
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  return results.filter((r) => {
    const key = `${r.name}-${r.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Reverse geocode locally (nearest city)
 */
export function reverseGeocodeLocal(lat, lng) {
  let nearest = null;
  let minDist = Infinity;

  const allCoords = { ...CITY_COORDS, ...WORLD_CITY_COORDS };
  for (const [city, coords] of Object.entries(allCoords)) {
    const dist = Math.sqrt(
      Math.pow(coords.lat - lat, 2) + Math.pow(coords.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = { city, ...coords };
    }
  }

  if (nearest) {
    const isPak = !!CITY_COORDS[nearest.city];
    return {
      name: nearest.city,
      fullName: `${nearest.city}, ${isPak ? 'Pakistan' : nearest.country}`,
      lat: nearest.lat,
      lng: nearest.lng,
      country: isPak ? 'Pakistan' : nearest.country,
      countryCode: isPak ? 'PK' : 'XX',
      distance: minDist,
      source: 'local',
    };
  }
  return null;
}

// ==========================================
// HELPER FUNCTIONS - CASE INSENSITIVE (FIXED)
// ==========================================

export const getAllCities = () => PAKISTAN_CITIES.getAllCities();

/**
 * GET CITY COORDINATES - CASE INSENSITIVE (FIXED)
 */
export const getCityCoordinates = (city) => {
  if (!city) return null;

  const cityStr = String(city).trim();

  // 1. Direct match (exact)
  if (CITY_COORDS[cityStr]) return CITY_COORDS[cityStr];
  if (WORLD_CITY_COORDS[cityStr]) return WORLD_CITY_COORDS[cityStr];

  // 2. Case-insensitive match
  const cityLower = cityStr.toLowerCase();

  const pakKey = Object.keys(CITY_COORDS).find(
    (key) => key.toLowerCase() === cityLower
  );
  if (pakKey) return CITY_COORDS[pakKey];

  const worldKey = Object.keys(WORLD_CITY_COORDS).find(
    (key) => key.toLowerCase() === cityLower
  );
  if (worldKey) return WORLD_CITY_COORDS[worldKey];

  // 3. Partial match (agar "Gujar" likha ho)
  const pakPartial = Object.keys(CITY_COORDS).find(
    (key) => key.toLowerCase().includes(cityLower)
  );
  if (pakPartial) return CITY_COORDS[pakPartial];

  const worldPartial = Object.keys(WORLD_CITY_COORDS).find(
    (key) => key.toLowerCase().includes(cityLower)
  );
  if (worldPartial) return WORLD_CITY_COORDS[worldPartial];

  return null;
};

/**
 * GET PROVINCE FROM CITY - CASE INSENSITIVE (FIXED)
 */
export const getProvinceFromCity = (city) => {
  if (!city) return 'Unknown';

  const cityLower = String(city).toLowerCase().trim();

  for (const [province, cities] of Object.entries(PAKISTAN_CITIES.provinces)) {
    const found = cities.find(
      (c) => c.toLowerCase() === cityLower
    );
    if (found) return province;
  }

  // World cities
  const worldKey = Object.keys(WORLD_CITY_COORDS).find(
    (key) => key.toLowerCase() === cityLower
  );
  if (worldKey) {
    return WORLD_CITY_COORDS[worldKey].country || 'Unknown';
  }

  return 'Unknown';
};

/**
 * IS PAKISTANI CITY - CASE INSENSITIVE (FIXED)
 */
export const isPakistaniCity = (city) => {
  if (!city) return false;
  const cityLower = String(city).toLowerCase().trim();
  return Object.keys(CITY_COORDS).some(
    (key) => key.toLowerCase() === cityLower
  );
};

/**
 * IS WORLD CITY - CASE INSENSITIVE (FIXED)
 */
export const isWorldCity = (city) => {
  if (!city) return false;
  const cityLower = String(city).toLowerCase().trim();
  return Object.keys(WORLD_CITY_COORDS).some(
    (key) => key.toLowerCase() === cityLower
  );
};

export const getAllWorldCities = () => Object.keys(WORLD_CITY_COORDS);

/**
 * GET CITY COUNTRY - CASE INSENSITIVE (FIXED)
 */
export const getCityCountry = (city) => {
  if (!city) return 'Unknown';
  const cityLower = String(city).toLowerCase().trim();

  const worldKey = Object.keys(WORLD_CITY_COORDS).find(
    (key) => key.toLowerCase() === cityLower
  );
  if (worldKey) return WORLD_CITY_COORDS[worldKey].country;

  const pakKey = Object.keys(CITY_COORDS).find(
    (key) => key.toLowerCase() === cityLower
  );
  if (pakKey) return 'Pakistan';

  return 'Unknown';
};

export const getCitiesByProvince = (province) => {
  return PAKISTAN_CITIES.provinces[province] || [];
};

export const getAllProvinces = () => Object.keys(PAKISTAN_CITIES.provinces);

export const getAllCountries = () => Object.keys(WORLD_CITIES);

/**
 * Advanced search with filters
 */
export async function advancedSearch(query, options = {}) {
  const { useAPI = true, limit = 20, country = null } = options;

  let results = [];

  if (useAPI) {
    try {
      results = await searchCityAPI(query, limit);
    } catch (e) {
      results = searchCityLocal(query);
    }
  } else {
    results = searchCityLocal(query);
  }

  if (country) {
    results = results.filter(
      (r) => r.country?.toLowerCase() === country.toLowerCase()
    );
  }

  return results.slice(0, limit);
}

// ==========================================
// EXPORT DEFAULT
// ==========================================
export default {
  PAKISTAN_CITIES,
  WORLD_CITIES,
  CITY_COORDS,
  WORLD_CITY_COORDS,
  API_CONFIG,
  getAllCities,
  getCityCoordinates,
  getProvinceFromCity,
  isPakistaniCity,
  isWorldCity,
  getAllWorldCities,
  getCityCountry,
  getCitiesByProvince,
  getAllProvinces,
  getAllCountries,
  searchCityLocal,
  reverseGeocodeLocal,
  searchCityAPI,
  reverseGeocodeAPI,
  getCityCoordsOpenWeather,
  getWeatherAPI,
  getCityInfo,
  advancedSearch,
};