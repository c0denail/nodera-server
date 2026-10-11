# Nodera sunucusu: buradan başla

Bu rehber henüz hostingi olmayan kullanıcı içindir. Başlangıçta GitHub ve Render hesabı kullanılır. Render, deneme için HTTPS adresi verir; ayrı alan adı veya VPS gerekmez. Nodera bilgisayara kurulan masaüstü uygulaması olmaya devam eder. Sunucuda üyelik, makine ilanları, rezervasyon ve bağlantı aktarımı çalışır. Windows sanal makineleri kaynak sahibinin bilgisayarında kalır.

Bu paket hazırdır; internette henüz yayımlanmadı. Gerçek Atlas bağlantı bilgileri pakette bulunmaz. Şu anki EXE yalnızca bu bilgisayardaki `127.0.0.1:8080` hizmetini kullanır.

## 1. Sunucu paketini GitHub'a yükle

1. `nodera-api.zip` dosyasını boş bir klasöre çıkar.
2. [GitHub](https://github.com/new) üzerinde `nodera-server` adlı **private** bir depo oluştur. Hesabın yoksa önce hesap oluştur.
3. **Add file → Upload files** ile çıkardığın klasörün içeriğini deponun köküne yükle ve kaydet. `package.json`, `package-lock.json`, `identity.cjs` ve `render.yaml` doğrudan kökte olmalı; bunları fazladan bir alt klasöre koyma.
4. Paketteki `.env.example` bir şablondur ve yüklenebilir. Gerçek `.env`, Atlas parolası, yerel proje klasörü, EXE, VM dosyaları ve `node_modules` yüklenmez.

## 2. Render'da tek bir Web Service oluştur

1. [Render Dashboard](https://dashboard.render.com/) üzerinde hesap oluşturup **New → Web Service** seç.
2. GitHub hesabını bağlarken yalnızca `nodera-server` deposuna erişim ver ve bu depoyu seç.
3. Aşağıdaki ayarları gir:

   | Ayar | Değer |
   | --- | --- |
   | Name | `nodera-server` veya başka benzersiz bir ad |
   | Language / Runtime | `Node` |
   | Branch | Dosyaları yüklediğin dal; genellikle `main` |
   | Root Directory | Boş bırak |
   | Build Command | `npm ci --omit=dev` |
   | Start Command | `npm start` |
   | Health Check Path | `/health` |
   | Instance Type | İlk kısa denemede `Free` |
   | Instance sayısı | `1`; bu sürümde çoğaltma kullanma |

Paket Node.js sürümünü `>=24 <25` olarak tanımlar. Web Service kullan; Static Site veya ayrı bir veritabanı servisi oluşturma. Mevcut Atlas veritabanın kullanılacak. Aynı depo için ayrıca Blueprint oluşturma; `render.yaml` bu ayarların alternatif kurulum şablonudur.

## 3. Gizli ortam değişkenlerini gir

Render'ın **Environment** bölümüne şunları ekle:

| Anahtar | Değer |
| --- | --- |
| `MONGODB_URI` | Mevcut Atlas bağlantı adresin; gerçek kullanıcı ve parolayı içerir |
| `MONGODB_DATABASE` | `nodera` |
| `AUTH_RATE_SECRET` | En az 32 karakterlik rastgele, benzersiz bir değer |
| `TRUST_PROXY` | `1` |

`AUTH_RATE_SECRET` için Node.js bulunan kendi bilgisayarında şu komutla rastgele değer üretebilirsin:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Çıkan değeri sadece Render'ın gizli ortam alanına yapıştır. Parola veya bağlantı adresini GitHub'a, EXE'ye ya da sohbete yazman gerekmez. `PORT` değerini Render verir; `HOST` ekleme. `.env.example` içindeki `HOST=127.0.0.1` satırını Render'a taşımamalısın; hizmet varsayılan olarak `0.0.0.0` üzerinde dinler.

**Create Web Service** ile oluştur. Atlas erişimi henüz tanımlı olmadığı için ilk açılış başarısız olabilir; sonraki adımı tamamla.

## 4. Render'ın çıkış IP'lerine Atlas erişimi ver

1. Render'da oluşturduğun servisin sayfasını aç.
2. Sağ üstte **Connect → Outbound** bölümündeki IP/CIDR aralıklarının tamamını kopyala.
3. Atlas projesinde **Security → Network Access / IP Access List → Add IP Address** ile bu aralıkları ekle ve **Active** olmalarını bekle.
4. Render'a dönüp **Manual Deploy → Deploy latest commit** seç.

Burada Atlas'a eklenen adresler Render'ın çıkış adresleridir. Ev bilgisayarının IP'sini eklemek tek başına sunucuya erişim vermez. `0.0.0.0/0` ile genel erişim açmak gerekmez.

## 5. Hizmetin hazır olduğunu doğrula

Render servis sayfasındaki gerçek HTTPS adresini kopyala. Aşağıdaki adres yalnızca biçim örneğidir; mevcut bir Nodera sunucusu değildir:

```text
https://SENIN-SERVIS-ADIN.onrender.com/health
```

Tarayıcıda açınca şu alanlar gelmeli:

```json
{
  "status": "ok",
  "service": "nodera-identity",
  "version": "0.4.1",
  "capabilities": ["marketplace", "rdp-relay"]
}
```

`/health` çalışmıyorsa henüz EXE'yi bu adrese bağlama. Render olay/günlük ekranındaki güvenli hata kodunu kontrol et:

| Belirti | Kontrol |
| --- | --- |
| `CONFIG_SECRET` | `AUTH_RATE_SECRET` en az 32 karakter mi? |
| `ATLAS_TLS` veya Atlas zaman aşımı | Outbound IP aralıklarının tümü Atlas'ta Active mi? TLS hatasının başka ağ nedenleri de olabilir. |
| Atlas kimlik doğrulama hatası | Veritabanı kullanıcısı, parola ve bağlantı adresindeki URL kodlaması doğru mu? |
| Atlas yetki hatası | Veritabanı kullanıcısının `nodera` üzerinde `readWrite` yetkisi var mı? |
| Yeni yayından sonra yaklaşık bir dakika bekleme | Ücretsiz servis uykudan açılıyor olabilir. |

Ham MongoDB hatalarını veya gizli Environment ekranını paylaşma; görünen güvenli hata kodu yeterlidir.

## 6. Gerçek sunucu adresiyle EXE hazırlanır

Hazır olduğunda paylaşman gereken tek bilgi `https://...onrender.com` adresidir. Atlas şifresini tekrar göndermene gerek yok. Geliştirici tarafında mevcut Nodera projesinde:

```powershell
node apps/desktop/scripts/configure-auth.mjs https://SENIN-SERVIS-ADIN.onrender.com
pnpm desktop:build
```

Adrese `/health` veya `/v1` eklenmez. Üretilen EXE iki bilgisayara da kurulur. Son kullanıcı sadece Nodera hesabıyla giriş yapar.

**Mevcut VM kayıtları:** API adresi değişince uygulama farklı bir yerel profil veritabanı seçer. Önceki VM dosyaları silinmez; yeni adrese otomatik aktarılmaz. Mevcut VM'yi yeni sunucu hesabına taşımak, EXE dağıtılmadan önce ayrıca planlanmalıdır. Eski profili veya VM'yi bu amaçla silme.

## 7. İki bilgisayarla kabul kontrolü

1. İki bilgisayarda da `/health` yanıtı alınabilmeli; aynı HTTPS sunucusuyla hazırlanmış EXE kullanılmalı.
2. Makine sahibinin VM'sinde Windows kurulumu, ayrı standart kullanıcı, RDP/NLA ve temiz taban hazır olmalı. [VM hazırlık adımları](KIRALAMA_KURULUM.md).
3. Sahip **Kiralamaya aç** seçer; diğer hesap **Hazır sanal makineler** sekmesinde gerçek ilanı görür.
4. Kiracı **Bağlan** seçip Windows oturumunu açar. Aynı VM için ikinci rezervasyon kabul edilmemeli.
5. **Sonlandır** sonrası bağlantı kapanmalı, VM temiz tabana dönmeli. Temizleme tamamlanana kadar yeni kiracı kabul edilmemeli.
6. Sahip bilgisayarı veya uygulaması çevrimdışıyken makine müsait listesinde görünmemeli. İlan temizleme sonunda kapalı kalır; sahibi tekrar yayımlar.

## Ücretsiz denemenin sınırı

Render Free, 15 dakika gelen HTTP/WebSocket trafiği yoksa uyuyabilir; tekrar açılış yaklaşık bir dakika sürer. Aylık saat, trafik ve derleme kotası vardır; ödeme yöntemi varsa bazı aşımlar ücret oluşturabilir, yoksa hizmet durdurulabilir. RDP aktarımı Render'ın dış trafik kullanımına dahildir. Kullanım ve faturalama alanını izleyerek kısa testler yap; kesintisiz kiralama için sürekli çalışan uygun bir sunucu/plan ayrıca seçilir. Free plan üretim hizmeti olarak değerlendirilmemeli.

Yeniden yayın veya hosting yeniden başlatması aktif RDP tünellerini keser. İlan ve hesaplar Atlas'ta kalır; VM parolası sadece sunucu belleğindedir ve yeniden girilmesi gerekir. Bu paket tek sunucu süreci için hazırlanmıştır.

Paketlenmiş API gerçek geçici MongoDB ile doğrulanmıştır. Render yayını ve iki fiziksel bilgisayarda Windows RDP/checkpoint kabul testi henüz yapılmamıştır.

Resmî kaynaklar: [Render Node yayını](https://render.com/docs/deploy-node-express-app), [WebSocket desteği](https://render.com/docs/websocket), [çıkış IP'leri](https://render.com/docs/outbound-ip-addresses), [Free sınırları](https://render.com/docs/free), [Atlas IP erişim listesi](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
