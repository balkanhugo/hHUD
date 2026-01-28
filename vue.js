// https://discord.gg/EkwWvFS
const app = new Vue({
  el: '#app',
  data: {
    ui: true,
    
    // Loading animations
    isStatusLoading: true,
    isMoneyLoading: true,
    
    showHudMenu: false,
    activeTab: 'elements',
    
    // Renk Seçici Kontrolü
    showColorPicker: false,
    currentColorElement: '',
    
    // Hazır Renk Paleti
    presetColors: [
      { name: 'Red', r: 239, g: 68, b: 68 },
      { name: 'Pink', r: 236, g: 72, b: 153 },
      { name: 'Purple', r: 147, g: 51, b: 234 },
      { name: 'Blue', r: 59, g: 130, b: 246 },
      { name: 'Cyan', r: 6, g: 182, b: 212 },
      { name: 'Teal', r: 20, g: 184, b: 166 },
      { name: 'Green', r: 16, g: 185, b: 129 },
      { name: 'Lime', r: 132, g: 204, b: 22 },
      { name: 'Yellow', r: 234, g: 179, b: 8 },
      { name: 'Orange', r: 249, g: 115, b: 22 },
      { name: 'Rose', r: 244, g: 63, b: 94 },
      { name: 'Indigo', r: 99, g: 102, b: 241 },
      { name: 'Violet', r: 139, g: 92, b: 246 },
      { name: 'Fuchsia', r: 217, g: 70, b: 239 },
      { name: 'Emerald', r: 5, g: 150, b: 105 },
      { name: 'Amber', r: 245, g: 158, b: 11 },
      { name: 'White', r: 255, g: 255, b: 255 },
      { name: 'Gray', r: 156, g: 163, b: 175 },
      { name: 'Dark', r: 75, g: 85, b: 99 },
      { name: 'Black', r: 0, g: 0, b: 0 },
      { name: 'Gold', r: 255, g: 215, b: 0 },
      { name: 'Silver', r: 192, g: 192, b: 192 },
      { name: 'Bronze', r: 205, g: 127, b: 50 },
      { name: 'Neon', r: 57, g: 255, b: 20 }
    ],
    
    // HUD Elementlerinin Görünürlük Ayarları
    hudSettings: {
      showHealth: true,
      showArmor: true,
      showHunger: true,
      showThirst: true,
      showStress: true,
      showMoney: true,
      showVehicle: true,
      showLocation: true
    },
    
    // HUD Renk Ayarları (RGB)
    hudColors: {
      health: { r: 239, g: 68, b: 68 },     // red-500
      armor: { r: 59, g: 130, b: 246 },     // blue-500
      fuel: { r: 245, g: 158, b: 11 },      // amber-500
      nitrous: { r: 6, g: 182, b: 212 },    // cyan-500
      speed: { r: 16, g: 185, b: 129 },     // emerald-500
      hunger: { r: 249, g: 115, b: 22 },    // orange-500
      thirst: { r: 6, g: 182, b: 212 },     // cyan-500
      stress: { r: 147, g: 51, b: 234 }     // purple-500
    },
    // Durum Çubukları
    health: 75,
    armor: 50,
    hunger: 80,
    thirst: 65,
    stress: 30,
    parachute: false,
    
    // Hız ve Araç Bilgileri
    inVehicle: false,
    speed: 0,
    displaySpeed: 0, // Animasyonlu hız gösterimi için
    maxSpeed: 300,
    gear: 'N',
    previousGear: 'N', // Gear transition için
    fuel: 85,
    nitrous: 100,
    rpm: 0,
    displayRpm: 0, // Animasyonlu RPM için
    maxRPM: 8500,
    engineHealth: 1000,
    seatbeltOn: false,
    cruiseOn: false,
    
    // Para Bilgileri
    cash: 150000,
    bank: 850000,
    blackMoney: 25000,
    
    // Oyuncu Bilgileri
    job: 'Police',
    jobName: 'Police Officer',
    jobGrade: 3,
    playerId: 1,
    onlinePlayers: 48,
    maxPlayers: 128,
    
    // Lokasyon ve Zaman
    location: '',
    currentTime: '',
    
    // Detaylı Lokasyon Bilgileri
    streetName: 'Vinewood Boulevard',
    zoneName: 'Vinewood Hills, Los Santos',
    heading: 180,
    
    // Oyuncu pozisyonu
    playerPos: {
      x: -1000.5,
      y: 500.3,
      z: 25.7
    },
  },
  computed: {
    // RPM yüzde hesaplama
    rpmPercentage() {
      return Math.min(100, (this.displayRpm / this.maxRPM) * 100);
    },
    
    // Dinamik renk stilleri
    healthColor() {
      return `rgb(${this.hudColors.health.r}, ${this.hudColors.health.g}, ${this.hudColors.health.b})`;
    },
    
    armorColor() {
      return `rgb(${this.hudColors.armor.r}, ${this.hudColors.armor.g}, ${this.hudColors.armor.b})`;
    },
    
    fuelColor() {
      return `rgb(${this.hudColors.fuel.r}, ${this.hudColors.fuel.g}, ${this.hudColors.fuel.b})`;
    },
    
    nitrousColor() {
      return `rgb(${this.hudColors.nitrous.r}, ${this.hudColors.nitrous.g}, ${this.hudColors.nitrous.b})`;
    },
    
    speedColor() {
      return `rgb(${this.hudColors.speed.r}, ${this.hudColors.speed.g}, ${this.hudColors.speed.b})`;
    },

    hungerColor() {
      return `rgb(${this.hudColors.hunger.r}, ${this.hudColors.hunger.g}, ${this.hudColors.hunger.b})`;
    },

    thirstColor() {
      return `rgb(${this.hudColors.thirst.r}, ${this.hudColors.thirst.g}, ${this.hudColors.thirst.b})`;
    },

    stressColor() {
      return `rgb(${this.hudColors.stress.r}, ${this.hudColors.stress.g}, ${this.hudColors.stress.b})`;
    },
    
    // Speedometer renkleri
    speedColorDynamic() {
      const speed = this.displaySpeed; // Animated speed kullan
      if (speed > 180) return '#ef4444'; // Kırmızı
      if (speed > 120) return '#f59e0b'; // Sarı
      if (speed > 60) return '#10b981';  // Yeşil
      return '#3b82f6'; // Mavi
    },
    
    // Engine health rengi
    engineHealthColor() {
      if (this.engineHealth > 800) return '#10b981'; // Yeşil
      if (this.engineHealth > 500) return '#f59e0b'; // Sarı
      return '#ef4444'; // Kırmızı
    }
  },
  watch: {
    // HUD ayarları değiştiğinde otomatik kaydet
    hudSettings: {
      handler() {
        this.saveHudSettings();
      },
      deep: true
    },
    
    // Renk ayarları değiştiğinde otomatik kaydet
    hudColors: {
      handler() {
        this.saveColorSettings();
      },
      deep: true
    }
  },
  methods: {
    // Para formatını düzenleyen fonksiyon
    formatMoney(amount) {
      // Standart format - her zaman tam sayı olarak göster
      return '$' + amount.toLocaleString();
    },
    
    // Saat güncelleme fonksiyonu
    updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      this.currentTime = `${hours}:${minutes} ${day}/${month}/${year}`;
    },
    
    // Gear pozisyonu türkçe
    getGearText(gear) {
      const gearMap = {
        'P': 'Park',
        'R': 'Geri',
        'N': 'Boş',
        'D': 'İleri'
      };
      return gearMap[gear] || gear;
    },
    
    // Pusula yönü
    getCardinalDirection(heading) {
      if (heading === null || heading === undefined) return 'N';
      
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const index = Math.round(((heading % 360) / 45)) % 8;
      return directions[index];
    },

    // RPM hesaplama fonksiyonu
    calculateRPM(speed, gear) {
      if (gear === 'N' || gear === 'R') {
        return 1000; // Boşta veya geri viteste idle RPM
      }
      
      const gearNum = parseInt(gear);
      const gearRatios = {
        1: { minSpeed: 0, maxSpeed: 30, minRPM: 1500, maxRPM: 7500 },
        2: { minSpeed: 20, maxSpeed: 60, minRPM: 2000, maxRPM: 7000 },
        3: { minSpeed: 40, maxSpeed: 90, minRPM: 2500, maxRPM: 6500 },
        4: { minSpeed: 70, maxSpeed: 120, minRPM: 2500, maxRPM: 6000 },
        5: { minSpeed: 100, maxSpeed: 160, minRPM: 2500, maxRPM: 5500 },
        6: { minSpeed: 140, maxSpeed: 300, minRPM: 2000, maxRPM: 5000 }
      };
      
      const ratio = gearRatios[gearNum] || gearRatios[1];
      
      // Vites aralığındaki hız yüzdesi
      const speedRange = ratio.maxSpeed - ratio.minSpeed;
      const speedInRange = Math.max(0, Math.min(speed - ratio.minSpeed, speedRange));
      const speedPercentage = speedInRange / speedRange;
      
      // RPM hesaplama
      const rpmRange = ratio.maxRPM - ratio.minRPM;
      const calculatedRPM = ratio.minRPM + (rpmRange * speedPercentage);
      
      // Gerçekçi RPM dalgalanması
      const fluctuation = Math.sin(Date.now() * 0.001) * 50;
      
      return Math.round(calculatedRPM + fluctuation);
    },
    
    // Durum çubuklarını güncelleme fonksiyonları
    updateHealth(value) {
      this.health = Math.max(0, Math.min(100, value));
    },
    
    updateArmor(value) {
      this.armor = Math.max(0, Math.min(100, value));
    },
    
    updateHunger(value) {
      this.hunger = Math.max(0, Math.min(100, value));
    },
    
    updateThirst(value) {
      this.thirst = Math.max(0, Math.min(100, value));
    },
    
    updateStress(value) {
      this.stress = Math.max(0, Math.min(100, value));
    },
    
    toggleParachute(state) {
      this.parachute = state;
    },
    
    // Araç bilgilerini güncelleme fonksiyonları
    updateSpeed(value) {
      this.speed = Math.max(0, Math.min(this.maxSpeed, value));
      // Hız değiştiğinde RPM'i de güncelle
      this.rpm = this.calculateRPM(this.speed, this.gear);
    },
    
    updateGear(gear) {
      this.gear = gear;
      // Vites değiştiğinde RPM'i güncelle
      this.rpm = this.calculateRPM(this.speed, this.gear);
    },
    
    updateFuel(value) {
      this.fuel = Math.max(0, Math.min(100, value));
    },
    
    updateNitrous(value) {
      this.nitrous = Math.max(0, Math.min(100, value));
    },
    
    updateRPM(value) {
      this.rpm = Math.max(0, Math.min(this.maxRPM, value));
    },
    
    setVehicleState(state) {
      this.inVehicle = state;
      if (!state) {
        this.speed = 0;
        this.gear = 'N';
        this.rpm = 0;
      }
    },
    
    // Para güncelleme fonksiyonları
    updateCash(amount) {
      this.cash = Math.max(0, amount);
    },
    
    updateBank(amount) {
      this.bank = Math.max(0, amount);
    },
    
    updateBlackMoney(amount) {
      this.blackMoney = Math.max(0, amount);
    },
    
    // Oyuncu bilgileri güncelleme
    updateJob(job) {
      this.job = job;
    },
    
    updateJobName(jobName) {
      this.jobName = jobName;
    },
    
    updateJobGrade(grade) {
      this.jobGrade = grade;
    },
    
    updatePlayerId(id) {
      this.playerId = id;
    },
    
    updatePlayerCount(online, max) {
      this.onlinePlayers = online;
      this.maxPlayers = max;
    },
    
    // Player count formatı
    getPlayerCountInfo() {
      return `${this.onlinePlayers}/${this.maxPlayers}`;
    },
    
    // Lokasyon güncelleme
    updateLocation(loc) {
      this.location = loc;
    },
    
    // Detaylı lokasyon bilgilerini güncelleme
    updateStreetName(street) {
      this.streetName = street;
    },
    
    updateZoneName(zone) {
      this.zoneName = zone;
    },
    
    updateHeading(heading) {
      this.heading = heading;
    },
    
    // Oyuncu pozisyonu güncelleme
    updatePlayerPosition(x, y, z) {
      this.playerPos.x = x;
      this.playerPos.y = y;
      this.playerPos.z = z;
    },
    

    
    // Oyuncu ID gösterimi
    getPlayerInfo() {
      return `ID: ${this.playerId}`;
    },
    

    
    // UI'ı göster/gizle
    toggleUI(state) {
      this.ui = state;
    },
    
    // HUD Menüsünü aç/kapat
    toggleHudMenu() {
      this.showHudMenu = !this.showHudMenu;
      if (!this.showHudMenu) {
        // Menu kapandığında client'a bildir
        fetch('https://es-nexus/closehud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      }
    },
    
    closeHudMenu() {
      this.showHudMenu = false;
      // Menu kapandığında client'a bildir
      fetch('https://es-nexus/closehud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
    },
    
    // Renk seçiciyi aç
    openColorPicker(element) {
      this.currentColorElement = element;
      this.showColorPicker = true;
    },
    
    // RGB'den Hex'e çevir
    getHexColor(element) {
      if (!element || !this.hudColors[element]) return '#000000';
      const color = this.hudColors[element];
      return '#' + [color.r, color.g, color.b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    },
    
    // Hex'den RGB'ye çevir - direkt uygulanır
    setColorFromHex(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result && this.currentColorElement) {
        this.hudColors[this.currentColorElement] = {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        };
      }
    },
    
    // Hazır renk seç - direkt uygulanır
    setPresetColor(color) {
      if (this.currentColorElement) {
        this.hudColors[this.currentColorElement] = { ...color };
      }
    },
    
    // Mevcut rengi varsayılana sıfırla
    resetCurrentColor() {
      if (this.currentColorElement) {
        const defaultColors = {
          health: { r: 239, g: 68, b: 68 },
          armor: { r: 59, g: 130, b: 246 },
          fuel: { r: 245, g: 158, b: 11 },
          nitrous: { r: 6, g: 182, b: 212 },
          speed: { r: 16, g: 185, b: 129 },
          hunger: { r: 249, g: 115, b: 22 },
          thirst: { r: 6, g: 182, b: 212 },
          stress: { r: 147, g: 51, b: 234 }
        };
        this.hudColors[this.currentColorElement] = { ...defaultColors[this.currentColorElement] };
      }
    },
    
    // Durum ikonları için stil (icon color + drop shadow)
    getStatusIconStyle(type) {
      const color = this.hudColors[type];
      return `color: rgb(${color.r}, ${color.g}, ${color.b}); 
              filter: drop-shadow(0 0 4px rgba(${color.r}, ${color.g}, ${color.b}, 0.6));`;
    },
    
    // Status icon container (background + border)
    getStatusIconContainerStyle(type) {
      const color = this.hudColors[type];
      return `background: rgba(${color.r}, ${color.g}, ${color.b}, 0.2); 
              border: 1px solid rgba(${color.r}, ${color.g}, ${color.b}, 0.3);`;
    },
    
    // Durum ikon renkleri
    getStatusIconColor(type) {
      const color = this.hudColors[type];
      return {
        color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        filter: `drop-shadow(0 0 6px rgba(${color.r}, ${color.g}, ${color.b}, 0.6))`
      };
    },
    
    // Enhanced status fill style with professional gradients
    getStatusFillStyle(type, percentage) {
      const color = this.hudColors[type];
      const darkerR = Math.max(0, color.r - 30);
      const darkerG = Math.max(0, color.g - 30);
      const darkerB = Math.max(0, color.b - 30);
      const lighterR = Math.min(255, color.r + 20);
      const lighterG = Math.min(255, color.g + 20);
      const lighterB = Math.min(255, color.b + 20);
      
      return {
        width: `${percentage}%`,
        background: `linear-gradient(90deg, 
          rgb(${darkerR}, ${darkerG}, ${darkerB}) 0%, 
          rgb(${color.r}, ${color.g}, ${color.b}) 50%, 
          rgb(${lighterR}, ${lighterG}, ${lighterB}) 100%)`,
        boxShadow: `0 0 8px rgba(${color.r}, ${color.g}, ${color.b}, 0.4), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        filter: `drop-shadow(0 0 4px rgba(${color.r}, ${color.g}, ${color.b}, 0.6))`
      };
    },
    
    // Yakıt ikonu stili
    getFuelIconStyle() {
      const color = this.hudColors.fuel;
      return {
        color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        filter: `drop-shadow(0 0 8px rgba(${color.r}, ${color.g}, ${color.b}, 0.6))`
      };
    },
    
    // Nitro ikonu stili
    getNitrousIconStyle() {
      const color = this.hudColors.nitrous;
      return {
        color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        filter: `drop-shadow(0 0 8px rgba(${color.r}, ${color.g}, ${color.b}, 0.6))`
      };
    },
    
    // RPM rengi (dinamik, hız bazlı)
    getRpmColor() {
      if (this.rpm < 5000) {
        return this.speedColor; // Normal hız rengi
      } else if (this.rpm >= 5000 && this.rpm < 7000) {
        return this.fuelColor; // Orta hız (fuel rengi)
      } else {
        return this.healthColor; // Yüksek hız (health rengi - tehlike)
      }
    },
    
    // Renk seçiciyi kapat
    closeColorPicker() {
      this.showColorPicker = false;
      this.currentColorElement = '';
      // Color picker modal kapatılınca ana menü açıksa focus'u koru
      if (!this.showHudMenu) {
        fetch('https://es-nexus/closehud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      }
    },
    
    // Renk seçiciyi kaydet
    saveColor() {
      if (this.currentColorElement) {
        this.hudColors[this.currentColorElement] = { ...this.tempColor };
        this.saveColorSettings();
      }
      this.closeColorPicker();
    },
    
    // Renk seçiciyi varsayılana sıfırla
    resetColor() {
      this.hudColors[this.currentColorElement] = { r: 239, g: 68, b: 68 }; // Default for health
      this.saveColorSettings();
      this.closeColorPicker();
    },
    
    // Renkleri varsayılana sıfırla
    resetColors() {
      this.hudColors = {
        health: { r: 239, g: 68, b: 68 },
        armor: { r: 59, g: 130, b: 246 },
        fuel: { r: 245, g: 158, b: 11 },
        nitrous: { r: 6, g: 182, b: 212 },
        speed: { r: 16, g: 185, b: 129 },
        hunger: { r: 249, g: 115, b: 22 },
        thirst: { r: 6, g: 182, b: 212 },
        stress: { r: 147, g: 51, b: 234 }
      };
    },
    
    // Tüm HUD elementlerini aç/kapat
    toggleAllHud(state) {
      Object.keys(this.hudSettings).forEach(key => {
        this.hudSettings[key] = state;
      });
      this.saveHudSettings();
    },
    
    // Klavye kısayolları
    handleKeyPress(event) {
      // J tuşu - HUD menüsünü aç/kapat
      if (event.key === 'j' || event.key === 'J') {
        event.preventDefault();
        this.toggleHudMenu();
      }
      
      // ESC tuşu ile menüyü kapat
      if (event.key === 'Escape' && this.showHudMenu) {
        event.preventDefault();
        this.showHudMenu = false;
        // Menu kapandığında client'a bildir
        fetch('https://es-nexus/closehud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      }
    },
    
    // Test için demo animasyon
    runDemo() {
      // Araçta olduğumuzu simüle et
      this.inVehicle = true;
      this.location = 'Los Santos - Downtown';
      
      // Başlangıç lokasyonu
      this.streetName = 'Vinewood Boulevard';
      this.zoneName = 'Vinewood Hills, Los Santos';
      this.heading = 0;
      this.playerPos = { x: -1000, y: 500, z: 25 };
      
      // Lokasyon değişim simülasyonu
      const locations = [
        { street: 'Vinewood Boulevard', zone: 'Vinewood Hills, Los Santos' },
        { street: 'Sunset Boulevard', zone: 'West Vinewood, Los Santos' },
        { street: 'Great Ocean Highway', zone: 'Del Perro, Los Santos' },
        { street: 'Las Lagunas Blvd', zone: 'Mission Row, Los Santos' },
        { street: 'Elgin Avenue', zone: 'Hawick, Los Santos' }
      ];
      
      let locationIndex = 0;
      setInterval(() => {
        if (this.inVehicle && this.speed > 30) {
          locationIndex = (locationIndex + 1) % locations.length;
          const loc = locations[locationIndex];
          this.streetName = loc.street;
          this.zoneName = loc.zone;
        }
      }, 8000); // Her 8 saniyede lokasyon değiştir
      
      // Hız animasyonu
      let speedInterval = setInterval(() => {
        if (this.speed < 180) {
          this.speed += 3;
          // Her 30 km/h'de vites değiştir
          if (this.speed < 30) {
            this.gear = '1';
          } else if (this.speed < 60) {
            this.gear = '2';
          } else if (this.speed < 90) {
            this.gear = '3';
          } else if (this.speed < 120) {
            this.gear = '4';
          } else if (this.speed < 150) {
            this.gear = '5';
          } else {
            this.gear = '6';
          }
          
          // RPM'i güncelle
          this.rpm = this.calculateRPM(this.speed, this.gear);
        } else {
          clearInterval(speedInterval);
          // Yavaşlama
          setTimeout(() => {
            let slowInterval = setInterval(() => {
              if (this.speed > 0) {
                this.speed -= 2;
                // Yavaşlarken vites düşür
                if (this.speed < 30) {
                  this.gear = '1';
                } else if (this.speed < 60) {
                  this.gear = '2';
                } else if (this.speed < 90) {
                  this.gear = '3';
                } else if (this.speed < 120) {
                  this.gear = '4';
                } else if (this.speed < 150) {
                  this.gear = '5';
                } else {
                  this.gear = '6';
                }
                
                // RPM'i güncelle
                this.rpm = this.calculateRPM(this.speed, this.gear);
                
                if (this.speed <= 0) {
                  this.speed = 0;
                  this.gear = 'N';
                  this.rpm = 1000; // İdle RPM
                  clearInterval(slowInterval);
                  // Araçtan in
                  setTimeout(() => {
                    this.inVehicle = false;
                    this.rpm = 0;
                  }, 2000);
                }
              }
            }, 50);
          }, 3000);
        }
      }, 50);
      
      // Yakıt azalması
      let fuelInterval = setInterval(() => {
        if (this.fuel > 0 && this.speed > 0) {
          this.fuel -= 0.05;
        }
      }, 200);
      
      // Durum çubukları değişimi
      setInterval(() => {
        // Açlık ve susuzluk yavaş azalır
        if (this.hunger > 0) this.hunger -= 0.03;
        if (this.thirst > 0) this.thirst -= 0.05;
        
        // Stres rastgele değişir
        this.stress = Math.max(0, Math.min(100, this.stress + (Math.random() - 0.5) * 1));
        
        // Health simülasyonu
        if (Math.random() > 0.95 && this.health > 30) {
          this.health -= Math.floor(Math.random() * 10);
        }
      }, 1000);
      
      // Pozisyon simülasyonu (demo için)
      setInterval(() => {
        this.playerPos.x += (Math.random() - 0.5) * 2;
        this.playerPos.y += (Math.random() - 0.5) * 2;
        this.playerPos.z += (Math.random() - 0.5) * 0.5;
      }, 500);
    },
    
    // HUD ayarlarını kaydet (localStorage ve server'a)
    saveHudSettings() {
      localStorage.setItem('hudSettings', JSON.stringify(this.hudSettings));
      // Server'a da kaydet
      this.sendConfigUpdate();
    },
    
    // HUD ayarlarını yükle (localStorage'dan)
    loadHudSettings() {
      const saved = localStorage.getItem('hudSettings');
      if (saved) {
        try {
          this.hudSettings = { ...this.hudSettings, ...JSON.parse(saved) };
        } catch (e) {
          console.warn('HUD ayarları yüklenemedi:', e);
        }
      }
      
      // Server'dan da yükle
      this.loadFromServer();
    },
    
    // Renk ayarlarını kaydet (localStorage ve server'a)
    saveColorSettings() {
      localStorage.setItem('hudColors', JSON.stringify(this.hudColors));
      // Server'a da kaydet
      this.sendConfigUpdate();
    },
    
    // Renk ayarlarını yükle (localStorage'dan)
    loadColorSettings() {
      const saved = localStorage.getItem('hudColors');
      if (saved) {
        try {
          this.hudColors = { ...this.hudColors, ...JSON.parse(saved) };
        } catch (e) {
          console.warn('Renk ayarları yüklenemedi:', e);
        }
      }
    },
    
    // Server'dan ayarları yükle
    loadFromServer() {
      if (typeof GetParentResourceName === 'function') {
        fetch(`https://${GetParentResourceName()}/loadConfig`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.settings) {
            this.hudSettings = { ...this.hudSettings, ...data.settings };
          }
          if (data.colors) {
            this.hudColors = { ...this.hudColors, ...data.colors };
          }
        })
        .catch(error => {
          console.warn('Server ayarları yüklenemedi:', error);
        });
      }
    },

    // Config güncellemelerini client'a gönder
    sendConfigUpdate() {
      fetch(`https://${GetParentResourceName()}/updateConfig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hudSettings: this.hudSettings,
          hudColors: this.hudColors
        })
      });
    },
    
    // Demo mod çalıştır
    runDemo() {
      let demoActive = true;
      const demoData = {
        health: 75,
        armor: 50,
        hunger: 80,
        thirst: 65,
        stress: 30,
        cash: 15000,
        bank: 85000,
        blackMoney: 2500,
        speed: 0,
        fuel: 85,
        rpm: 0,
        gear: 'P',
        inVehicle: false
      };
      
      // Demo verilerini uygula
      Object.assign(this, demoData);
      
      // Animasyonlu demo
      setInterval(() => {
        if (!demoActive) return;
        
        // Rastgele hız değişimi
        if (this.inVehicle) {
          this.speed = Math.floor(Math.random() * 180);
          this.rpm = this.calculateRPM(this.speed, this.gear);
          this.fuel = Math.max(10, this.fuel - Math.random() * 0.5);
        }
        
        // Rastgele durum değişimleri
        this.health = Math.max(0, Math.min(100, this.health + (Math.random() - 0.5) * 2));
        this.hunger = Math.max(0, Math.min(100, this.hunger - Math.random() * 0.1));
        this.thirst = Math.max(0, Math.min(100, this.thirst - Math.random() * 0.1));
        
        // Araç içi/dışı geçişi
        if (Math.random() < 0.1) {
          this.inVehicle = !this.inVehicle;
          if (this.inVehicle) {
            this.gear = 'D';
          } else {
            this.gear = 'P';
            this.speed = 0;
            this.rpm = 0;
          }
        }
      }, 1000);
      
      // Demo'yu durdur
      setTimeout(() => {
        demoActive = false;
      }, 60000); // 1 dakika sonra durdur
    },
    
    // Smooth speed animation
    animateSpeed(targetSpeed) {
      const startSpeed = this.displaySpeed;
      const speedDiff = targetSpeed - startSpeed;
      const duration = 300; // 300ms animation
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        this.displaySpeed = Math.round(startSpeed + (speedDiff * easeOut));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    },
    
    // Smooth RPM animation
    animateRpm(targetRpm) {
      const startRpm = this.displayRpm;
      const rpmDiff = targetRpm - startRpm;
      const duration = 200; // 200ms animation
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 2);
        
        this.displayRpm = Math.round(startRpm + (rpmDiff * easeOut));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    },
    
    // Gear transition effect
    changeGear(newGear) {
      if (this.gear !== newGear) {
        this.previousGear = this.gear;
        
        // Gear transition effect
        const gearElement = document.querySelector('.gear-track');
        if (gearElement) {
          gearElement.style.transform = 'scale(1.1)';
          setTimeout(() => {
            gearElement.style.transform = 'scale(1)';
          }, 200);
        }
        
        this.gear = newGear;
        
        // Play gear sound effect (isteğe bağlı)
        // this.playGearSound();
      }
    },
    
    // Vehicle enter/exit animations
    onVehicleEnter() {

      
      // Speedometer fade in with scale effect
      const speedometer = document.querySelector('.speedometer-container');
      if (speedometer) {
        speedometer.style.transform = 'scale(0.8) translateY(20px)';
        speedometer.style.opacity = '0';
        
        setTimeout(() => {
          speedometer.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          speedometer.style.transform = 'scale(1) translateY(0)';
          speedometer.style.opacity = '1';
        }, 100);
      }
      
      // Staggered animation for individual elements
      const elements = document.querySelectorAll('.gear-position');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.transform = 'scale(1.2)';
          setTimeout(() => {
            el.style.transform = 'scale(1)';
          }, 150);
        }, index * 50);
      });
    },
    
    onVehicleExit() {

      
      // Reset animated values
      this.animateSpeed(0);
      this.animateRpm(0);
      this.changeGear('P');
    }
  },
  mounted() {
    this.loadHudSettings();
    this.loadColorSettings();
    this.updateTime();
    setInterval(this.updateTime, 60000);
    
    // Progressive loading animation
    setTimeout(() => {
      this.isStatusLoading = false;
    }, 1500);
    
    setTimeout(() => {
      this.isMoneyLoading = false;
    }, 2000);
    
    document.addEventListener('keydown', this.handleKeyPress);
    
    // NUI Message Listener
    window.addEventListener('message', (event) => {
      const data = event.data;
      
      switch(data.type) {
        case 'toggleUI':
          this.ui = data.show;
          break;
          
        case 'toggleHudMenu':
          this.showHudMenu = !this.showHudMenu;
          break;
          
        case 'initConfig':
          // Config ayarlarını al
          if (data.config) {
            this.maxSpeed = data.config.maxSpeed || 300;
            this.maxRPM = data.config.maxRPM || 8500;
            
            // Varsayılan ayarları uygula
            if (data.config.defaultSettings) {
              this.hudSettings = { ...this.hudSettings, ...data.config.defaultSettings };
            }
            
            // Varsayılan renkleri uygula
            if (data.config.defaultColors) {
              this.hudColors = { ...this.hudColors, ...data.config.defaultColors };
            }
          }
          break;
          
        case 'updateAll':
          const hudData = data.data || data;
          this.ui = true;
          
          // Debug için log
  
          
          // Toplu veri güncellemesi (daha performanslı)
          // Loading state updates
          if (hudData.hunger !== undefined || hudData.thirst !== undefined || hudData.stress !== undefined) {
            this.isStatusLoading = false;
          }
          if (hudData.cash !== undefined || hudData.bank !== undefined || hudData.blackMoney !== undefined) {
            this.isMoneyLoading = false;
          }

          Object.assign(this, {
            // Player Data
            health: hudData.health !== undefined ? Math.max(0, hudData.health) : this.health,
            armor: hudData.armor !== undefined ? hudData.armor : this.armor,
            hunger: hudData.hunger !== undefined ? hudData.hunger : this.hunger,
            thirst: hudData.thirst !== undefined ? hudData.thirst : this.thirst,
            stress: hudData.stress !== undefined ? hudData.stress : this.stress,
            
            // Money Data
            cash: hudData.cash !== undefined ? hudData.cash : this.cash,
            bank: hudData.bank !== undefined ? hudData.bank : this.bank,
            blackMoney: hudData.blackMoney !== undefined ? hudData.blackMoney : this.blackMoney,
            
            // Player Info
            playerId: hudData.playerId !== undefined ? hudData.playerId : this.playerId,
            jobName: hudData.jobName !== undefined ? hudData.jobName : this.jobName,
            jobGrade: hudData.jobGrade !== undefined ? hudData.jobGrade : this.jobGrade,
            onlinePlayers: hudData.onlinePlayers !== undefined ? hudData.onlinePlayers : this.onlinePlayers,
            maxPlayers: hudData.maxPlayers !== undefined ? hudData.maxPlayers : this.maxPlayers,
            
            // Vehicle Data
            fuel: hudData.fuel !== undefined ? hudData.fuel : this.fuel,
            nitrous: hudData.nitrous !== undefined ? hudData.nitrous : this.nitrous,
            engineHealth: hudData.engineHealth !== undefined ? hudData.engineHealth : this.engineHealth,
            seatbeltOn: hudData.seatbelt !== undefined ? hudData.seatbelt : this.seatbeltOn,
            cruiseOn: hudData.cruise !== undefined ? hudData.cruise : this.cruiseOn,
            
            // Location Data
            streetName: hudData.streetName !== undefined ? hudData.streetName : this.streetName,
            zoneName: hudData.zoneName !== undefined ? hudData.zoneName : this.zoneName,
            heading: hudData.heading !== undefined ? hudData.heading : this.heading
          });
          
          // Position güncelleme
          if (hudData.x !== undefined && hudData.y !== undefined && hudData.z !== undefined) {
            this.playerPos = { x: hudData.x, y: hudData.y, z: hudData.z };
          }
          
          // Vehicle state handling with animations
          if (hudData.inVehicle !== undefined && hudData.inVehicle !== this.inVehicle) {
            if (hudData.inVehicle) {
              this.onVehicleEnter();
            } else {
              this.onVehicleExit();
            }
            this.inVehicle = hudData.inVehicle;
          }
          
          // Animated speed update
          if (hudData.speed !== undefined && hudData.speed !== this.speed) {
            this.speed = hudData.speed;
            this.animateSpeed(hudData.speed);
          }
          
          // Animated RPM update
          if (hudData.rpm !== undefined && hudData.rpm !== this.rpm) {
            this.rpm = hudData.rpm;
            this.animateRpm(hudData.rpm);
          }
          
          // Smooth gear change
          if (hudData.gear !== undefined && hudData.gear !== this.gear) {
            this.changeGear(hudData.gear);
          }
          break;
          
        case 'updateHUD':
          // Eski sistem için uyumluluk
          if (data.health !== undefined) this.health = Math.max(0, data.health);
          if (data.armor !== undefined) this.armor = data.armor;
          if (data.hunger !== undefined) this.hunger = data.hunger;
          if (data.thirst !== undefined) this.thirst = data.thirst;
          if (data.stress !== undefined) this.stress = data.stress;
          break;
          
        case 'updateMoney':
          // Para bilgileri
          if (data.cash !== undefined) this.cash = data.cash;
          if (data.bank !== undefined) this.bank = data.bank;
          if (data.blackMoney !== undefined) this.blackMoney = data.blackMoney;
          break;
          
        case 'updatePlayer':
          // Oyuncu bilgileri
          if (data.id !== undefined) this.playerId = data.id;
          if (data.jobName !== undefined) this.jobName = data.jobName;
          if (data.jobGrade !== undefined) this.jobGrade = data.jobGrade;
          if (data.online !== undefined) this.onlinePlayers = data.online;
          if (data.max !== undefined) this.maxPlayers = data.max;
          break;
          
        case 'updateVehicle':
          // Araç bilgileri
          this.inVehicle = data.inVehicle || false;
          if (data.inVehicle) {
            if (data.speed !== undefined) this.speed = data.speed;
            if (data.gear !== undefined) this.gear = data.gear;
            if (data.fuel !== undefined) this.fuel = data.fuel;
            if (data.rpm !== undefined) this.rpm = data.rpm;
            if (data.nitrous !== undefined) this.nitrous = data.nitrous;
            if (data.maxSpeed !== undefined) this.maxSpeed = data.maxSpeed;
          }
          break;
          
        case 'updateLocation':
          // Lokasyon bilgileri
          if (data.streetName !== undefined) this.streetName = data.streetName;
          if (data.zoneName !== undefined) this.zoneName = data.zoneName;
          if (data.heading !== undefined) this.heading = data.heading;
          if (data.x !== undefined && data.y !== undefined && data.z !== undefined) {
            this.playerPos = { x: data.x, y: data.y, z: data.z };
          }
          break;
          
        // Eski speedometer sistemi için uyumluluk
        case 'CAR':
          this.inVehicle = true;
          if (data.speed !== undefined) this.speed = data.speed;
          if (data.gear !== undefined) this.gear = data.gear;
          if (data.fuel !== undefined) this.fuel = data.fuel;
          if (data.rpm !== undefined) this.rpm = data.rpm;
          break;
          
        case 'CIVIL':
          this.inVehicle = false;
          break;
          
        case 'STATUS':
          if (data.hunger !== undefined) {
            this.hunger = Math.max(0, Math.min(100, data.hunger));
            this.isStatusLoading = false;
          }
          if (data.thirst !== undefined) {
            this.thirst = Math.max(0, Math.min(100, data.thirst));
            this.isStatusLoading = false;
          }
          break;
          
        case 'STRESS':
          if (data.stress !== undefined) {
            this.stress = Math.max(0, Math.min(100, data.stress));
            this.isStatusLoading = false;
          }
          break;
          
        case 'PLAYER':
          if (data.player) {
            
          }
          break;
          
        case 'ACCOUNT':
          if (data.type && data.amount !== undefined) {
            if (data.type === 'CASH') {
              this.cash = Math.max(0, data.amount);
              this.isMoneyLoading = false;
            } else if (data.type === 'BANK') {
              this.bank = Math.max(0, data.amount);
              this.isMoneyLoading = false;
            }
          }
          break;
          
        case 'QBSET_CASH':
          if (data.amount !== undefined) {
            this.cash = Math.max(0, data.amount);
            this.isMoneyLoading = false;
          }
          break;
          
        case 'QBSET_BANK':
          if (data.amount !== undefined) {
            this.bank = Math.max(0, data.amount);
            this.isMoneyLoading = false;
          }
          break;
          
        case 'QBSET_CRYPTO':
          if (data.amount !== undefined) {
            this.blackMoney = Math.max(0, data.amount);
            this.isMoneyLoading = false;
          }
          break;
          
        // Job Update Events
        case 'JOB':
          if (data.label) {
            if (typeof data.label === 'string') {
              this.jobName = data.label;
            } else if (typeof data.label === 'object') {
              this.jobName = data.label.label || data.label.name || 'Unemployed';
              this.jobGrade = data.label.grade?.level || data.label.grade || 0;
            }
            this.isMoneyLoading = false;
          }
          break;
      }
    });
    
         // Demo modu için (test amaçlı)
     if (window.location.search.includes('demo=true')) {
       this.runDemo();
     }
     
     // UI aktif olduğunda başlangıç mesajı
 
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
});
