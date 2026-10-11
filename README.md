# Nodera: MongoDB Atlas ile merkezi üyelik kurulumu

## Bu bilgisayarda hazır olan deneme bağlantısı

10 Ekim 2026: Gerçek Atlas kümesine bağlanıldı; `nodera` veritabanında indeksler ve yazma/geri okuma erişimi doğrulandı. Örnek kullanıcı oluşturulmadı. Bağlantı sırrı yalnızca bu çalışma alanındaki, Git tarafından dışlanan `apps/api/.env` dosyasındadır.

Üyelik API’si bu bilgisayarda `127.0.0.1:8080` üzerinde çalışır. `apps/desktop/nodera.config.json` dosyasındaki `localIdentityPilot: true` seçimi, yalnızca loopback HTTP adresine izin verir. 0.4.1 kurulum paketi bu deneme adresini kullanır; EXE Atlas bağlantı parolası içermez. Uygulamanın normal üyelik ekranından açılan hesap gerçek Atlas’a yazılır. Aynı EXE başka bilgisayara kurulduğunda bu bilgisayarın yerel üyelik hizmetine ulaşamaz; bunun için aşağıdaki HTTPS hosting adımları gerekir.

Bilgisayar yeniden başlatıldıysa proje klasöründeki `UYELIK_HIZMETINI_BASLAT.cmd` dosyasını çift tıklayarak üyelik hizmetini yeniden aç. Node.js 24 veya bu bilgisayardaki Codex Node çalışma zamanı kullanılır. Bu yardımcı sunucu yalnızca geliştirici denemesi içindir; genel dağıtımda gizli `.env` dosyası kullanıcı bilgisayarlarına verilmez. `pnpm dev` de yerel pilot ayarı açıkken eksik üyelik hizmetini başlatabilir.

**Başlatma hatası:** Ev internetinin dış IP'si değiştiğinde Atlas izin listesini güncellemek gerekebilir. Atlas → Security → Network Access bölümünde **Add Current IP Address** ile güncel IP'yi ekleyip **Active** olmasını bekleyin; sonra başlatıcıyı yeniden çalıştırın. `ATLAS_TLS` hatasında ilk kontrol budur; hata tek başına izin listesinin hatalı olduğunu kanıtlamaz. Başlatıcı Atlas TLS, DNS, kullanıcı/parola, yetki ve port hatalarını ayrı mesajlarla gösterir. Yerel günlükler `.data/identity-logs/` altında tutulur; bağlantı adresi veya parolası hata mesajına yazılmaz. Yerel pilotun `PORT` değeri `8080` olmalı. Bağlantıyı doğrulamak için `http://127.0.0.1:8080/health` adresinde `status: ok` ve `service: nodera-identity` yanıtını kontrol edin.

0.4.0 ile hesap oluşturma, giriş ve çıkışa ek olarak ilan, rezervasyon ve RDP tünel hizmeti vardır. Akış: **Nodera EXE → HTTPS/WSS Nodera API’si → MongoDB Atlas**. Atlas bağlantı adresi ve veritabanı parolası sadece API sunucusunda bulunur. EXE’ye yalnızca API’nin herkese açık HTTPS adresi eklenir. Gerçek VM hazırlığı ve sunucu yayını için [kiralama kurulum rehberini](KIRALAMA_KURULUM.md) kullanın.

Atlas’ta `nodera` veritabanında üyelik için şu üç koleksiyon kullanılır; kiralama koleksiyonları tablonun altında açıklanmıştır:

| Koleksiyon      | İçerik                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `users`         | Hesap kimliği, ad, küçük harfe çevrilmiş e-posta, salt içeren scrypt parola özeti, oluşturma tarihi |
| `auth_sessions` | Oturum anahtarının SHA-256 özeti, hesap kimliği, oluşturma ve son kullanma tarihi                   |
| `auth_attempts` | Giriş/kayıt deneme sayacı; IP ve e-posta HMAC özetiyle tutulur, süresi dolunca temizlenir           |

Kaynak bütçeleri, yerel VM kayıtları, ISO/VHDX yolları ve VM dosyaları cihazda kalır. Kullanıcı açıkça bir VM'yi yayımlarsa ilan adı, CPU/RAM/disk/ağ özellikleri ve sahip/cihaz/makine kimlikleri `rental_listings` koleksiyonuna, oturum tarafları ve sonlandırma zamanı `rental_history` koleksiyonuna kaydedilir. Windows VM parolası Atlas'a yazılmaz. Aynı hesapla iki bilgisayardan giriş yapılabilir. Hazır makineler listesi ve internetten bağlantı için iki uygulama da aynı HTTPS/WSS sunucusunu kullanmalıdır; bu bilgisayardaki loopback hizmetine başka bilgisayardan ulaşılamaz.

## 1. MongoDB Atlas hesabı ve kümesi

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) üzerinde hesabını oluştur ve giriş yap.
2. Bir proje oluştur; adını `Nodera` koyabilirsin.
3. **Build a Database / Create a deployment** ekranında **Free / M0** seçeneğini seç. Deneme için yeterlidir; başlangıçta ücretli Flex/Dedicated seçmen gerekmiyor. Planı onaylamadan ücret bilgisini kontrol et.
4. Uygulama sunucusuna yakın bir bölge seç ve kümeyi oluştur. **Örnek veri yükleme / sample dataset** seçeneğini kapat.
5. **Database Access** altında uygulama için ayrı bir veritabanı kullanıcısı oluştur. Örneğin `nodera_api`; güçlü, benzersiz bir parola kullan. Yalnızca `nodera` veritabanında `readWrite` yetkisi ver; Atlas proje yöneticisi yetkisi gerekmez. Atlas hesabın ile bu veritabanı kullanıcısı farklıdır.
6. **Connect → Drivers → Node.js** ile `mongodb+srv://...` bağlantı adresini al. Parolayı şablondaki parola alanına yerleştir. Özel karakterler URL kodlaması gerektirir. Bu adresi sohbete veya GitHub’a koyma; sonraki adımda hostingin gizli ortam değişkenine gir.

Koleksiyonları elle oluşturman veya kullanıcı eklemen gerekmiyor. API ilk bağlantısında indeksleri oluşturur. `users.email` benzersizdir; oturum ve deneme kayıtlarının süre indeksleri vardır. İndeks oluşturma hatası varsa API hazır duruma geçmez.

[Atlas bağlantı koşulları](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/), [ücretsiz küme kurulumu](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/).

## 2. Hosting yoksa: Render ile deneme yayını

Projede `release/nodera-api.zip` yayımlamaya hazır API paketidir. Kaynak geliştirmesinden yeniden üretmek için `pnpm api:package` kullanılır. Paket Node.js 24 ve gerçek MongoDB sürücüsünü kullanır; kullanıcı, VM veya örnek veri içermez.

1. ZIP’i `nodera-identity-service` adlı klasöre çıkar. Bu klasörün **içeriğini** yeni, tercihen private bir GitHub deposuna yükle: `identity.cjs`, `package.json`, `package-lock.json`, `render.yaml`, `.gitignore`, `.env.example` ve bu rehber. Gerçek `.env` dosyasını yükleme. Ana Nodera projesini veya `.build-tools`, `.data`, `node_modules`, EXE ve VM dosyalarını yüklemene gerek yok.
2. [Render](https://dashboard.render.com/) üzerinde hesap aç. **New → Web Service** seçip bu depoyu bağla. Blueprint kullanmayı tercih edersen paketteki `render.yaml` da aynı ayarları içerir; ikisini birden oluşturma.
3. Dil/runtime **Node**, instance planı **Free**, build komutu `npm ci --omit=dev`, start komutu `npm start`, health check yolu `/health` olsun. HTTPS adresi Render tarafından sağlanır; bu deneme için alan adı satın almak gerekmez.
4. **Environment** bölümüne şu değerleri ekle:

   | Anahtar            | Değer                                                                                             |
   | ------------------ | ------------------------------------------------------------------------------------------------- |
   | `MONGODB_URI`      | Atlas’ın verdiği, veritabanı kullanıcısı ve parolasını içeren gerçek bağlantı adresi; gizli değer |
   | `MONGODB_DATABASE` | `nodera`                                                                                          |
   | `AUTH_RATE_SECRET` | En az 32 karakterlik rastgele bir gizli değer; Blueprint otomatik üretir                          |
   | `TRUST_PROXY`      | Render ters proxy’si arkasında `1`                                                                |

   `PORT` Render tarafından verilir. `HOST` eklemen gerekmez; API `0.0.0.0` üzerinde dinler. `MONGODB_URI` veya `AUTH_RATE_SECRET` için `VITE_` gibi istemciye açılan bir önek kullanma.

5. Servisi oluştur. İlk yayın, Atlas ağ erişimi henüz tanımlı olmadığından başarısız olabilir. Servis sayfasında **Connect → Outbound** alanındaki IP/CIDR aralıklarını kopyala. Atlas projesindeki **Network Access → IP Access List** bölümüne bu aralıkların hepsini ekle. Sadece kendi bilgisayarının IP’sini eklemek Render için yeterli değildir. Genel erişim veren `0.0.0.0/0` kullanman gerekmez.
6. Render’dan yeniden deploy et. API başlatılırken gerçek Atlas bağlantısı ve indeksler doğrulanır. Servis adresinin sonuna `/health` ekleyip açtığında `status: ok` ve `service: nodera-identity` yanıtı gelmeli.

**Free planın sınırı:** Render 15 dakika trafik almayan servisi uyutur; tekrar açılması yaklaşık bir dakika sürebilir. İlk giriş bu sırada bağlantı hatası gösterebilir. `/health` hazır olana kadar bekleyip tekrar dene. Bu, sürekli erişilebilir üretim hizmeti değildir. Kayıtlar API diski yerine Atlas’ta tutulduğu için hosting yeniden başladığında kaybolmaz.

[Render Node yayını](https://render.com/docs/deploy-node-express-app), [çıkış IP aralıkları](https://render.com/docs/outbound-ip-addresses), [ücretsiz plan sınırları](https://render.com/docs/free).

## 3. API adresini Nodera’ya bağlama

Canlı API hazır olduğunda geliştirici tarafında proje klasöründe:

```powershell
node apps/desktop/scripts/configure-auth.mjs https://SENIN-UYELIK-SERVISIN.onrender.com
pnpm dev
```

Komuttaki adresi Render’ın gerçek HTTPS servis adresiyle değiştir; `/health` veya `/v1/auth` son eki ekleme. Bu bir bağlantı şifresi değildir. Adres `apps/desktop/nodera.config.json` içine kaydedilir. Tarayıcı geliştirme arayüzünde kaynakları incelemek ve hesap açmak mümkündür; gerçek VM komutları masaüstü uygulamasını gerektirir.

Kurulacak EXE’ye aynı adresin eklenmesi için ardından `pnpm desktop:build` gerekir. Önceden verilen **0.2.0 EXE, bu yeni Atlas üyelik bağlantısını içermez**. 0.3.0 yerel pilot paketi bu bilgisayardaki gerçek Atlas API’siyle kayıt açabilir; genel dağıtım için HTTPS adresiyle yeniden paketlenir. Son kullanıcı Atlas hesabı veya veritabanı şifresi girmez; uygulamanın normal üyelik ekranını kullanır.

Yerel geliştirmede `NODERA_AUTH_URL` ortam değişkeni adresi geçici olarak değiştirebilir. Derlenen sürüm varsayılan adresini paketleme sırasında `apps/desktop/nodera.config.json` dosyasından alır. Paketleme betiği kullanıcı adı/parola içeren API adreslerini reddeder. Genel dağıtım HTTPS gerektirir; açıkça seçilen `localIdentityPilot` yalnızca loopback HTTP adreslerine istisna sağlar.

## 4. Gerçek kayıt kontrolü ve VM kurulumu

1. Nodera’da kendi e-posta adresin ve en az 12 karakterli parolanla hesap oluştur.
2. Atlas **Browse Collections → nodera → users** altında hesabın oluştuğunu kontrol et. Parolan açık metin görünmemeli; yalnızca `passwordHash` olmalı.
3. Çıkış yapıp aynı bilgilerle tekrar giriş yap. İkinci bir bilgisayarda aynı API adresiyle hazırlanmış EXE kullanıldığında aynı hesaba giriş yapılabilmeli.
4. CPU, RAM, depolama ve ağ bütçelerini bu bilgisayarda kaydet. Hyper-V uygunluğunu kontrol edip Windows ISO ile mevcut VM kurulum sihirbazını kullan.
5. Atlas bağlantısı Hyper-V’yi kurmaz, Windows ISO indirmez veya Windows lisansı sağlamaz. Gerçek VM kurulumu için mevcut masaüstü gereksinimleri ayrıca sağlanmalı.

## Eski yerel hesaplar ve oturum davranışı

0.2.0’ın `nodera.sqlite` dosyasındaki yerel hesaplar otomatik olarak Atlas’a aktarılmaz. Yalnızca aynı e-posta yazıldı diye eski hesaba/VM’ye erişim vermek güvenli değildir. Eski yerel dosya ve VM’ler silinmez. Merkezi hesapların bu cihazdaki kayıtları, API adresine göre ayrı bir `nodera-<kimlik>.sqlite` dosyasında tutulur. Eski VM’lerin yeni hesaba devri ayrıca yapılmalıdır. API adresini değiştirmek bu cihazdaki profil kayıtları için farklı bir alan seçer; adresi değiştirmeden önce bunu planla.

Parolalar sadece API’ye gönderilir; yerel profil önbelleğinde parola bulunmaz. 0.3.2’de kurulu Windows uygulamasının merkezi bearer tokenı DPAPI CurrentUser ile şifrelenerek saklanır ve arayüze gönderilmez. Uygulamayı kapatıp açmak yeniden parola girmeyi gerektirmez; açılışta merkezi API ile doğrulama yapılır. Kalıcı oturum en fazla 30 gündür. Standart API/web oturumunun varsayılan süresi 24 saattir; açık uygulamada merkezi doğrulama 30 saniyeye kadar önbelleklenir. Güncellemeden sonra bir kez giriş yapmak gerekir. API’yi de güncel paketle yeniden başlatın; eski API yeni girişlere yalnızca 24 saat süre verir. Merkezi hizmete ulaşılamadığında yeni kayıt/giriş ve doğrulama gereken yönetim işlemleri hata verir; çalışan VM kendiliğinden durdurulmaz. Açılıştaki geçici bağlantı hatasında şifreli kayıt korunur ve yeniden denenebilir. Çıkış, sunucuya ulaşılamasa bile bu cihazdaki şifreli oturumu temizler; merkezi iptal başarısızsa oturum en geç kendi süresinde sona erer.

E-posta doğrulama ve parola kurtarma bu kapsamda yoktur. Özellikle ücretli kiralamaya geçmeden bunlar eklenmelidir. Deneme kullanıcılarına bu sınırlama uygulamada gösterilir.

## Geliştirici: yerel API testi veya kendi VPS’in

Ana projede `apps/api/.env.example` dosyasını `apps/api/.env` olarak kopyala; gerçek Atlas bağlantısını sadece bu dosyaya yaz. Atlas’a kendi test bilgisayarının IP’sini ekle. Sonra:

```powershell
pnpm identity:dev
```

Yerel API `http://127.0.0.1:8080` üzerinde çalışır. İstemciden buna geliştirme sırasında bağlanmak için aynı PowerShell oturumunda:

```powershell
$env:NODERA_AUTH_URL = 'http://127.0.0.1:8080'
$env:NODERA_ALLOW_INSECURE_AUTH = '1'
pnpm dev
```

Bu ortam değişkeniyle seçilen HTTP istisnası yalnızca geliştirmede loopback adreslerine uygulanır. Kurulu sürümde HTTP ancak paketlenirken açıkça seçilen yerel pilot ayarıyla ve loopback adresinde kullanılabilir. Bu ayar Atlas kullanmadan örnek hesap üretmez; API gerçek veritabanına bağlanır. Tamamen yerel eski üyelik akışını test etmek gerekirse yalnızca geliştirmede `NODERA_LOCAL_ACCOUNTS=1` açıkça seçilir; merkezi hizmet ayarlanmışsa otomatik olarak ona geçmez.


Otomatik testler, geçici dizinde başlatılan **gerçek MongoDB süreci** üzerinde çalışır. Test hesapları sadece bu geçici veritabanına yazılır; Atlas’a veya uygulamanın kullanıcı verilerine yazılmaz. İlk test çalıştırması MongoDB test ikilisini indirebilir. Bunlar canlı Atlas hesabında yapılmış bir bağlantı testi değildir.
