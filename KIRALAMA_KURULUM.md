# Nodera 0.4.1: gerçek VM kiralama ve bağlantı

## Bu sürümün çalışma şekli

Windows uygulaması VM'yi bu bilgisayardaki Hyper-V üzerinde çalıştırır. Merkezi Node.js sunucusu Atlas'ta ilanları, atomik rezervasyonları ve oturum geçmişini tutar. İki uygulama sunucuya dışarı doğru WebSocket bağlantısı açar. RDP verisi bu bağlantılardan aktarılır; modem portu açılmaz. Kiracıdaki dinleyici yalnızca `127.0.0.1` üzerinde açılır. RDP'nin kendi şifreleme ve Windows kimlik doğrulaması korunur. Uzak Masaüstü ayrı bir Windows penceresinde açılır.

Şu anki ücretsiz pilotta oturum en fazla 60 dakikadır. Rezervasyondan sonra bağlantı 2 dakika içinde açılmalıdır. Aynı VM'yi iki kişi alamaz; bir hesap aynı anda yalnızca bir aktif kiralama alabilir. Makine sahibi kendi ilanını kiralayamaz. İlanlar otomatik oluşturulmaz; örnek makine ve kullanıcı eklenmez.

## 1. İnternetten kullanılacak sunucu

Hosting hesabın henüz yoksa önce [sunucu başlangıç rehberini](BURADAN_BASLA.md) izle. ZIP içinde aynı rehber `BURADAN_BASLA.md` adıyla bulunur; GitHub ve Render ile ilk HTTPS yayını adım adım anlatılır.

İki farklı bilgisayarın aynı **HTTPS/WSS sunucusuna** ulaşması gerekir. `127.0.0.1:8080` yalnızca o bilgisayardaki test içindir. Atlas tek başına WebSocket tüneli çalıştırmaz. EXE'yi başka bilgisayara kopyalamak, yerel sunucuyu erişilebilir yapmaz.

`nodera-api.zip` üyelik, ilan, rezervasyon ve WebSocket aktarım sunucusunu birlikte içerir. Tek bir sürekli çalışan Node.js 24 süreci kullanın. Bu sürüm birden çok sunucu replikası arasında dağıtık tünel eşleştirmesi yapmaz; replikayı **1** tutun. Sunucu veya WebSocket bağlantısı kesilirse ilanlar müsait sayılmaz. Kiralama bilgileri Atlas'ta kalır; yeniden yayımlamadan önce tamamlanmamış temizleme gerekir.

Hazır bir Linux VPS için paketi çıkarıp:

```sh
npm ci --omit=dev
node identity.cjs
```

Ortam değişkenleri `.env.example` içindeki sunucu değişkenleridir: `MONGODB_URI`, `MONGODB_DATABASE`, `AUTH_RATE_SECRET`, `HOST`, `PORT`, `TRUST_PROXY`. Node kendiliğinden `.env` yüklemez; yerel denemede `node --env-file=.env identity.cjs`, servis yöneticisinde korunan environment file kullanın. Gizli dosyayı Git'e veya EXE'ye eklemeyin. Atlas Network Access listesine **sunucunun çıkış IP'sini** ekleyin. Nodera API portunu yalnızca ters proxy'ye açın.

Caddy ile alan adı ve otomatik HTTPS örneği:

```caddyfile
nodera-api.example.com {
    reverse_proxy 127.0.0.1:8080
}
```

Örnek alan adını kendi alan adınızla değiştirin; DNS sunucuya gitmeli. Caddy WebSocket yükseltmesini taşır. Tek güvenilir ters proxy arkasında `TRUST_PROXY=1` kullanılır. Ücretli sunucu/alan adı otomatik satın alınmaz. Render paketi de WebSocket'i destekleyen bir Node servisine kurulabilir; ücretsiz servisin uyku ve yeniden başlatma davranışı devamlı kiralama için uygun değildir.

Çalışan hizmetin `/health` yanıtı `status: ok`, `service: nodera-identity` olmalı. Sonra ana projede:

```powershell
node apps/desktop/scripts/configure-auth.mjs https://GERCEK-SUNUCU-ADRESI
pnpm desktop:build
```

İki bilgisayara da aynı HTTPS adresiyle derlenmiş EXE'yi kurun. Adres değişikliği mevcut yerel profil/VM kayıtları için farklı bir alan seçer; mevcut VM'leri yeni sunucuya taşıma işlemi bu komutla otomatik yapılmaz. Eski yerel profil ve VM dosyaları silinmez. Yayımlamadan önce kendi hesabınızla iki cihazda test edin.

## 2. Kaynak sahibinin hazırlığı

1. VM'yi kurun ve Windows Pro/Enterprise/Education kullanın. Windows Home, RDP sunucusu olarak desteklenmez.
2. VM içindeki **Ayarlar → Sistem → Uzak Masaüstü** bölümünü açın. Ağ Düzeyi Kimlik Doğrulaması (NLA) açık kalsın.
3. VM içinde ayrı bir **standart kullanıcı** ve en az 12 karakterli parola oluşturun. Kullanıcıyı Uzak Masaüstü kullanıcılarına ekleyin. Ana bilgisayarın, VM yöneticisinin veya Nodera hesabının parolasını paylaşmayın.
4. Windows güncellemelerini tamamlayın; VM içindeki kişisel dosyaları, tarayıcı hesaplarını ve otomatik yönetici girişini kaldırın. Kiracılar bu hazırlık durumunu görecektir. Makine sahibinin VM'ye yönetici erişimi bulunduğu kiracıya gösterilir.
5. VM yalnızca **Internal** Hyper-V ağı kullanmalı. Nodera oluşturduğu makinede DHCP/DNS/RDP izinlerini ve özel ağlara giden trafik kısıtlamalarını uygular. Uygulama bu sürümde internete açık doğrudan RDP bağlantısı yayımlamaz.
6. Nodera'nın Hyper-V okuma/yönetim yetkisi olmalı. Gerekiyorsa Nodera'yı yönetici olarak çalıştırın. Sürekli paylaşımda uygulama açık ve Windows uyanık kalmalı.
7. **Sanal makineler → Kiralamaya aç → Temiz taban oluştur**. Bu işlem Windows'u kapatır, `Nodera-Rental-Base-v1` denetim noktasını oluşturur ve VM'yi başlatır. Yönetici onayı gerekebilir. Kurulum tamamlanmadan bu tabanı oluşturmayın. Denetim noktaları ek disk alanı tüketir; VM depolamasında yeterli boş alan bırakın.
8. Windows yeniden açılıp ağ hazır olunca **Kiralamaya aç** düğmesine yeniden basıp VM'nin standart kullanıcı bilgilerini girin. Bilgiler temiz taban alınırken belirlenen bilgilerle aynı olmalı. Uygulama canlı VM durumunu, Internal ağı, RDP portunu ve IP'nin VM MAC adresine ait olduğunu denetler. Windows kullanıcı/parolasının kabul edildiği gerçek RDP girişinde doğrulanır.

VM parolası yalnızca çalışan sunucu sürecinin belleğinde tutulur; Atlas'a, loga veya istemci ayar dosyasına yazılmaz. Yetkili kiracı giriş bilgilerini kendi oturumu sırasında görebilir. Sunucu veya paylaşım uygulaması yeniden başlatıldığında parola yeniden girilerek ilan açılır.

## 3. Kiracının kullanımı

**Hazır sanal makineler → Kiralanabilir makineler** bölümü yalnızca başka kullanıcıların çevrimiçi, RDP hazırlığı tamamlanmış ve müsait makinelerini gösterir. İşlemci, RAM ve depolama alt/üst sınırları birlikte uygulanır; kaynak miktarına göre sıralama ve 12 ilanlık sayfalama kullanılabilir. **Filtreleri temizle** bütün sınırları ve sıralamayı sıfırlar. **Bağlan** ile geçici oturum koşullarını onaylayın. Rezervasyon başarılı olursa Windows Uzak Masaüstü açılır; gösterilen VM kullanıcı adı/parolasını girin. RDP parolası Windows komut satırına yazılmaz veya Windows'a kalıcı kaydettirilmez. Disk, yazıcı, pano ve cihaz yönlendirmesi bu bağlantı dosyasında kapalıdır.

**Bu bilgisayardaki makinelerim** bölümünde kendi VM'leriniz oluşturulduktan sonra otomatik görünür. Aynı kaynak filtreleri bu bölüme de uygulanır. Kurulum/hazırlık durumu gösterilir; **Kiralamaya aç** buradan da kullanılabilir. Kendi makineniz kiracı ilanı olarak listelenmez. Yeni oluşturulan VM, Windows/RDP kurulumu ve yukarıdaki hazırlık adımları tamamlanmadan diğer kullanıcılara açılmaz.

Dosyalar geçicidir. Saklamak istediklerinizi oturum bitmeden VM'den kendi bulut hesabınıza aktarın. **Oturumlarım → Sonlandır** veya RDP bağlantısının kapanması tüneli keser, ilanı kilitler ve VM'nin temiz tabana dönmesini ister. Süre bittiğinde de oturum sonlandırılır. Windows kimlik doğrulama veya sertifika istemleri kullanıcı tarafından değerlendirilir; Nodera bunları otomatik onaylamaz.

## 4. Temizleme ve arızalar

Temizleme VM'yi kapatır, hazırlık denetim noktasına döndürür ve tekrar başlatır. Başarılı sonuç merkezi sunucuya bildirilmeden başka kiracı alınmaz. İlan temizleme sonrasında kapalı kalır; sahibi tekrar yayımlar. Yönetici onayı reddedilir veya Hyper-V hata verirse **Temizlemeyi tekrar dene** kullanılır. Hata sırasında kullanıcı dosyaları temizlenmiş gibi gösterilmez. Uygulama/ana bilgisayar çevrimdışıysa temizleme yeniden bağlantıda tamamlanır; o zamana kadar ilan kilitlidir.

Paylaşımı kapatmadan bilgisayarı kapatmak veya uygulamayı sonlandırmak aktif bağlantıyı keser. Sorunsuz kapanış için önce **Kiralamayı kapat**, temizlemenin tamamlanmasını bekleyin. VM'yi silme/kapatma gibi yönetim işlemleri açık ilan veya tamamlanmamış kiralama varken engellenir. Kaynak sahibi Hyper-V üzerinden yaptığı harici değişikliklerden sorumludur; sunucu kaybolan VM'yi hazır göstermez.

Atlas'taki ek koleksiyonlar: `rental_listings` (ilan, sahip/cihaz/makine kimliği ve rezervasyon kilidi), `rental_history` (sonlandırılan oturumların tarafları ve zamanı). Yerel ISO/VHDX yolları ve VM dosyaları Atlas'a aktarılmaz. E-posta doğrulama, parola kurtarma, ücret tahsilatı ve admin arayüzü bu pilotta yoktur.

## Doğrulama sınırı

Otomatik testler geçici gerçek MongoDB ve gerçek TCP/WebSocket soketleri kullanır; yarışan rezervasyonlar, yetki kontrolleri, parola gizliliği, süre sonu ve ikili veri aktarımı doğrulanır. Test hesapları canlı Atlas'a yazılmaz. Gerçek Windows VM'de RDP girişi ve denetim noktasından geri dönüş, Windows kurulumu ve standart kullanıcı hazırlandıktan sonra ayrıca denenmelidir. İnternet yayını ve iki ayrı fiziksel bilgisayar testi, gerçek HTTPS sunucusu yapılandırılmadan tamamlanmış sayılmaz.

[Microsoft RDP destek koşulları](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-supported-config), [Hyper-V denetim noktaları](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/checkpoints), [Caddy reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).
