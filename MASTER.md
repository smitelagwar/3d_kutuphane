# MimarKatalog — Ana Proje Talimatları (MASTER.md)

Bu dosya, **MimarKatalog** projesinin tüm tasarım, içerik, 3D model kalitesi, Türkiye pazarı standartları ve yapay zeka (Blender AI / MCP) çalışma kurallarını tek merkezde toplar. Gelecekteki her geliştirme, model ekleme veya arayüz güncellemesinde bu talimatlar esas alınır.

---

## 1. Projenin Amacı ve Kullanım Senaryosu
- **Kullanıcı Profili:** Blender'da villa, apartman dış cephe ve iç mekan görselleştirme ve animasyon/video projeleri üreten mimar / iç mimar.
- **Çift Kullanımlı Sistem (İnsan + Yapay Zeka):**
  - Mimar katalogdan ürünleri görselleriyle hızlıca görüp, 3D inceleyip renk/kaplama seçerek sahneye ekleyebilmeli.
  - Blender'ı yöneten yapay zeka ajanları (LLM / Blender MCP / Python `bpy`) aynı kataloğu API (`/api/v1/catalog`, `/llms.txt`, `/api/v1/manifest.json`) üzerinden okuyabilmeli, görsel + 3D model + ölçü + doku + prompt bilgilerinin tamamına ulaşabilmeli ve doğrudan sahneye model seçip aktarabilmeli.

---

## 2. Türkiye Pazarı ve Ürün Kapsamı
- Tüm ürünler **Türkiye'de gerçekte satılan, kullanılan ve Türkçe aratıldığında** (Google Görseller, Pinterest, Trendyol, Hepsiburada, İnegöl mobilya, VitrA / Kale / ECA / Artema / Geberit / Hüppe tarzı) karşılaşılan güncel mimari ve iç mekan ürünleri olmalıdır.
- **Öncelikli Ürün Grupları:**
  - **Banyo (Tam Kapsamlı):** Duvara asma kanalsız klozetler, rezervuarlı klozetler, pisuvarlar, sürgülü/pivot/walk-in cam duşakabinler, küvetler, 30×30 tepe duş başlıkları, yağmurlama duş robotları, ankastre/termostatik duş bataryaları, çanak ve standart lavabo bataryaları (musluk setleri), asma ve ayaklı banyo dolapları, seramik lavabolar, havlupanlar, duvar/halka havlu askılıkları, telefon raflı ve kapaklı tuvalet kağıtlıkları, banyo halıları ve klozet paspasları, LED banyo aynaları, ayna üstü aplikler, sabunluk/şampuanlık/klozet fırçalığı/çöp kovası, çamaşır sepeti ve çamaşır/kurutma makineleri.
  - **Salon & Oturma (İnegöl & Modern Türkiye):** Modern L köşe koltuklar, üçlü/ikili kanepeler, bukle/kadife berjerler, puflar, mermer/ceviz/zigon orta ve yan sehpalar, TV üniteleri, konsollar, kabartmalı/püsküllü salon halıları, kitaplıklar.
  - **Yemek & Mutfak:** Yemek masaları, yemek ve ada mutfak bar sandalyeleri, dresuar/konsollar, ankastre mutfak elemanları.
  - **Aydınlatma, Dekor & Dış Cephe:** Modern avize/sarkıtlar, lambader ve abajurlar, iç mekan bitkileri, dış cephe bioklimatik pergola ve bahçe/teras mobilyaları.

---

## 3. 3D Model Kalitesi ve Görsel–3D Tutarlılık Kuralları
- **Sıfırdan Kötü Model Yapmak Yasak:** Gerçekle alakası olmayan basit geometrik/prosedürel uydurma modeller kullanılmayacaktır.
- **Doğrulanmış Hazır Asset Havuzu:** Modeller internetten doğrulanmış, yüksek kaliteli hazır `.GLB` / `.GLTF` / `.BLEND` arşivlerinden (stüdyo taranmış PBR modeller) seçilip eklenmelidir.
- **%100 Görsel–3D Tutarlılığı:** Katalogda görünen ürün fotoğrafı ile 3D Stüdyo'da açılan model birebir aynı ürüne ait olmalı, oran ve form açısından kusursuz örtüşmelidir.
- **1:1 Metrik Ölçek:** Tüm modeller gerçek santimetre (`G×D×Y`) ölçülerinde ve Blender Z-Yukarı metre sistemine uyumlu olmalıdır.

---

## 4. Canlı Renk, PVD Metalik Kaplama ve PBR Kuralları
- Her modelde Türkiye mimari projelerinde kullanılan gerçek kaplama seçenekleri sunulmalıdır (ör. **Parlak Krom, Mat Siyah, Fırçalı Pirinç / Gold, Fırçalı Nikel, Füme Gunmetal, Rose Gold, Parlak/Mat Beyaz Seramik, Doğal Meşe, Amerikan Ceviz, Kaşmir Bej, Mat Antrasit**).
- **Özel RAL / HEX & Yüzey Stüdyosu:** Hazır tonlara ek olarak serbest renk seçimi, HEX girişi ve 4 yüzey modu (`Metalik PVD`, `Mat Yüzey`, `Saten`, `Parlak Sır`) anlık 3D sahnede çalışmalıdır.
- **Akıllı Cam / Ayna Koruması:** Duşakabin ve aynalarda cam/ayna yüzeyler şeffaf ve yansıtıcı kalmalı; renk değişimi yalnızca metal çerçeve, profil, kulp ve gövdeye uygulanmalıdır.
- **Tam Çıktı Senkronizasyonu:** Seçilen renk yalnızca önizlemede kalmamalı; `.GLB` dışa aktarımına, Sahne Listesine, AI JSON API çıktısına ve Blender `.PY` betiğindeki `Principled BSDF` düğümlerine otomatik yazılmalıdır.

---

## 5. 3D İnceleme, Teknik Detay, AI Prompt ve Benzer Ürünler
- **Geniş ve Odaklı 3D Önizleme:** 3D inceleme alanı geniş olmalı; renk, doku, kamera açısı ve indirme kontrolleri kompakt ve kullanışlı yerleştirilmelidir.
- **Yapay Zeka ve Mimar İçin Eksiksiz Teknik Bilgi:** Her modelin altında/panelinde; referans görsel, net ölçüler, doku/texture haritaları, püskül/kenar/derz gibi mikro detaylar, önerilen Blender modifier'ları, İngilizce Render/Cycles promptu ve Türkçe Blender MCP Master promptu hazır bulunmalıdır.
- **Aynı Tür Benzer Ürün Önerileri:** Kullanıcı hangi ürün tipini inceliyorsa (örneğin *Lavabo Bataryası*, *Duşakabin*, *Tuvalet Kağıtlığı*, *L Köşe Koltuk*), inceleme ekranının en altında **doğrudan aynı alt gruptaki diğer modeller** önerilmelidir ki hızlıca karşılaştırıp seçebilsin.

---

## 6. Arayüz, Hız ve Tasarım İlkeleri
- **Sıfır Gereksiz Yazı ve Pazarlama Kalabalığı:** Açılışta dev tanıtım kutuları, gereksiz paragraflar veya dolgu istatistikler olmayacaktır. Site açıldığında doğrudan hızlı ve etkin **katalog çalışma alanına** girilmelidir.
- **Kompakt ve Kaliteli Kontroller:** Tuşlar, sekmeler, kart aksiyonları ve filtreler sade, keskin, tek satır ve yüksek işçilikli (Poly Haven / Fab / Linear / Archiproducts estetiğinde) olmalıdır.
- **Güçlü Hiyerarşik Kategorizasyon:** Sol yan panelde tüm ana kategoriler ve ince alt ürün grupları (adet sayılarıyla) düzenli ağaç yapısında sunulmalı; tek tıkla filtreleme ve hızlı Türkçe arama yapılabilmelidir.

---

## 7. Komple Oda Tasarımları, Tam Ev Kapsamı & Doku Stüdyosu Kuralları
- **Komple Oda Tasarımları (`Oda Tasarımları`):** Salon, yatak odası, mutfak, banyo ve komple daire/ev içi hazır 3D oda sahneleri katalogda yer almalıdır. Her oda sahnesinin Blender `.PY` çıktısında yapay zekanın/mimarın tek tek eşyaları ayıklayabilmesi için alt mesh envanteri (`extracted_parts`) listelenmelidir.
- **Tüm Ev & Mimari Yapı Kapsamı:** Banyo ve salonun yanında **Yatak Odası** (çift kişilik baza/karyola, gardırop, giyinme dolabı, komodin, şifonyer, duvar yatağı, ranza), **Yemek & Mutfak** (mutfak adası, alt/üst/kiler mutfak dolapları, evye, ankastre fırın/ocak/davlumbaz, buzdolabı, bulaşık makinesi, şarap soğutucu), **Mimari & Çalışma** (iç kapılar, sürgülü/katlanır kapılar, pencere doğramaları, jaluzi & perdeler, villa merdivenleri, çalışma masası/ofis koltuğu, antre vestiyer/portmanto) ve **Dış Cephe** (kamelya/gazebo, pergola) hazır modelleri eksiksiz sunulmalıdır.
- **Kusursuz Renk + Dokunsal PBR Doku Seçimi:** Tüm hazır modellerde 16 mimari renk tonu + serbest RAL/HEX seçici ile birlikte canlı PBR kabartma dokuları (`Orijinal PBR`, `Bukle / Keten Kumaş`, `Doğal Meşe Ahşap`, `Damarlı Mermer / Taş`, `Fırçalanmış PVD Metal`, `Oluklu / Fitilli (Fluted)`, `Mikroçimento / Sıva`, `Ekstra Mat`, `Saten / Parlak`) anlık 3D sahnede ve Blender `bpy` shader düğümlerinde çalışmalıdır.
- **Temiz & Reklamsız Kaynak Politikası:** Reklam yönlendirmesi, virüs/sahte indirme butonu, üyelik duvarı veya Three.js/Blender uyumsuz `.max` dosyası barındıran siteler (ör. `open3dmodel.com`, `free3d.com`, `cgtrader.com`, `blendswap.com` doğrudan kazıma) yerine yalnızca doğrulanmış, temiz, doğrudan akışlı `.GLB`/`.GLTF` açık arşivleri kullanılacaktır.
- **Çamaşır Odası (Pinterest Mimari Dolap & Hazır Ekipman Havuzu):**
  - Hazır `.GLB` arşivlerinden doğrulanan üst üste/tekli çamaşır & kurutma makineleri, duvar tipi kapaklı ütü dolabı, çekmece içi katlanır ütü masası, buharlı steamer/ütü istasyonları, devrilir/köşe/oval çamaşır sepetleri, ahşap/bambu/metal duvar & kule kurutmalıklar, seramik/beton/kompozit çamaşır evyeleri ve amber cam deterjan şişeleri katalogda yer alır.
  - Hazır `.GLB` bulunmayan özel gömme Pinterest çamaşır dolabı kombinasyonları (yükseltilmiş çekmeceli sepet tepsili yan yana dolaplar, üst üste + devrilir çift kirli sepetli ve temiz havlu raflı kuleler, tezgah altı mermer katlama & pirinç askı nişli Hale Navy/Kaşmir Shaker üniteler, Belfast seramik evyeli üst üste kombinasyonlar, 126 cm katlı ütü masalı + dikey süpürgelikli kiler boy dolapları, her odaya uyumlu temiz-kirli ayırma dolapları, 72 cm dar apartman banyo/balkon kuleleri ve 4 makineli lüks villa çamaşır duvarları) stüdyo kalitesinde çok parçalı PBR 3D olarak modellenir ve katalog önizleme görselleri doğrudan 3D motordan birebir üretilir.

- **3D Model Akış Güvenilirliği & 32 MiB Limiti Koruması:** Büyük boyutlu (30–65 MB) yüksek çözünürlüklü PBR `.GLB` modelleri (özellikle dokuma halılar ve çok parçalı banyo modelleri) sunucu bellek/32 MiB yanıt sınırına takılmadan doğrudan CORS destekli CDN kaynaklarından akıtılır (`/api/v1/abo/glb` ve `/api/v1/hf/glb` doğrulanmış 302 yönlendirme uygular). Eski `KHR_materials_pbrSpecularGlossiness` uzantılı modeller de Three.js uyumluluk eklentisiyle sorunsuz açılır.
- **Moda Tasarım 3 Tonlu Halı Kombinasyonları (Tek Renk Yasağı):** Katalogdaki tüm salon, koridor ve banyo halılarında düz tek renk boyama yerine, orijinal PBR dokuma desenini, geometrik motifleri ve ilmek dokusunu %100 koruyan **3 tonlu iç mimari kombinasyonlar** (`Krem & Vizon Grej`, `Anadolu Terracotta & Ekru`, `Ege Lacivert & Altın Kum`, `Adaçayı, Keten & Yosun`, `Fildişi, Gümüş & Antrasit`, `Bordo Kilim & Şampanya`, `Hardal, Kum & Kömür` + özel Zemin/Desen/Kontrast 3 renkli mikser) kullanılır; aynı 3 tonlu yapı Blender `.PY` çıktısında `ShaderNodeRGBToBW` + `ShaderNodeValToRGB` ColorRamp düğümleriyle aktarılır.
- **Gerçek Satış Çok Parçalı Renk Kombinasyonları (Tek Renk Beyaz/Siyah Boyama Yasağı):** Tüm nesnelerde "Beyaz/Siyah" seçildiğinde bütün objeyi tek düze boyamak kesinlikle yasaktır. Her ürün grubuna gerçekte satılan versiyonlarına uygun çok parçalı PBR renk kombinasyonları tanımlanır (koltukta kumaş + ceviz/metal ayak + pirinç detay; banyo/mutfak/çamaşır dolabında ahşap/lake gövde + beyaz seramik lavabo/tezgah + siyah/gold armatür; yatakta başlık/baza rengi + otel beyazı nevresim koruması; aydınlatmada metal gövde + sıcak opal cam/keten abajur koruması; saksı bitkisinde yeşil yaprak koruması + seramik/terracotta saksı; ankastre cihazda inox/siyah gövde + koyu cam panel; iç kapıda lake/ahşap kanat + kontrast kulp/menteşe).
  - **Aşama 1 Tamamlandı (363 / 750 varlık):** `Banyo` (213), `Salon` (137) ve `Oda Tasarımları` (13).
  - **Aşama 2 Tamamlandı (387 / 750 varlık):** `Çamaşır Odası` (44), `Yatak Odası` (59), `Yemek & Mutfak` (116), `Mimari & Çalışma` (100), `Aydınlatma` (31), `Dekor & Bitki` (21) ve `Dış Cephe` (16).
  - **Genel Kapsam: 750 / 750 varlık (%100)** çok parçalı gerçek satış kombinasyonları veya 3 tonlu halı paletleriyle tamamlandı.
- **Kritik Türkiye Mimari Standartları & Gerçek Marka Logoları (Reklam Kısıtı Olmadan Gerçekçilik):**
  - Türkiye'de fiilen satılan gerçek markalar ve model serileri **birebir marka baskıları, LED/LCD panelleri ve resmi mağaza renk kombinasyonlarıyla** 3D modellere işlenir (`BOSCH Serie 6`, `SIEMENS iQ500`, `arçelik 9620`, `beko BM 6046`, `GEBERIT Sigma20 & Sigma30`, `VitrA Arkitekt`, `VİKO Karre`, `Schneider Electric Asfora`, `Vaillant ecoTEC Plus`, `E.C.A. Proteus Premix 24 kW`, `DemirDöküm Nitromix P 24 kW`, `Bosch Condens 2500 W 24 kW`, `DemirDöküm Tip 22 PKKP`, `E.C.A. / Artema`, `SUR / KALE Çelik Kapı`, `PELSAN / Jupiter`).
  - Türkiye mimarisinin kritik yerel elemanları (50×60 cm çevre yıkamalı **Alaturka Hela Taşı**, asma klozet üstü **Geberit Sigma20/30 Gömme Rezervuar Kumanda Panelleri**, **Avrupa Tipi Type F Schuko** topraklı priz/USB-C ve ikili komütatör anahtarlar, **4 büyük marka tam yoğuşmalı doğalgaz kombisi** (`Vaillant`, `E.C.A.`, `DemirDöküm`, `Bosch`), **Tip 22 PKKP panel radyatör + termostatik vana**, **95×210 cm zırhlı çelik dış kapı**, **48 cm spiralli yaylı mutfak bataryası**, **150 cm manyetik ray spot & lineer LED** ve **140 cm TV altı bioetanol villa şöminesi**) katalogda 1:1 metrik ölçüde, 3D önizleme ve Blender `.PY`/`.GLB` çıktısıyla tam desteklenir.
- **%100 Türkiye Piyasası Marka, Seri & Metrik Ölçü Doğrulaması (750 / 750 Varlık):**
  - Katalogdaki her bir ürün (`750 / 750`), Türkiye'de fiilen satılan gerçek marka, resmi seri ve satış kanalı (`turkishMarket`) ile eşleştirilmiştir (halıda `Merinos`, `Padişah`, `Pierre Cardin Halı`, `Saray Halı`, `Dinarsu`, `Kaşmir`, `English Home`, `Madame Coco`, `Özdilek`; koltuk/yemek masasında `Enza Home`, `Doğtaş`, `Bellona`, `İstikbal`, `Kelebek`, `Vivense`, `Mudo Concept`; tuvalet kağıtlığı/havluluk/banyoda `VitrA`, `Artema`, `E.C.A.`, `Tema Banyo`, `Grohe`, `Hammam`, `Carisa`, `Orka`, `Bien`, `Creavit`, `Kale`, `Hüppe`, `Sanica`; kombide `E.C.A.`, `DemirDöküm`, `Bosch Termoteknik`, `Vaillant`; mutfak/ofis/aydınlatmada `Lineadecor`, `Yataş`, `Çilek`, `Nurus`, `Bürotime`, `Avonni`, `Apliqa`, `Pelsan`).
  - Tüm yabancı ABD/Amazon model ön ekleri, İngilizce terimler, üçgen/poligon etiketleri ve inçten çevrilmiş Amerikan ölçüleri (`152×229`, `122×183`, `79×244`, `244 cm` vb.) temizlenip standart Türkiye metrik ölçülerine (`160×230`, `200×290`, `120×180`, `80×250`, `240 cm`) ve doğru kategori/alt gruplara oturtulmuştur.

---

## 8. Ek Talepler ve Güncelleme Notları
- *(Yeni isteklerinizi doğrudan bu alana ekleyip "Kaydet" tuşuna basarak kalıcı hale getirebilirsiniz.)*
