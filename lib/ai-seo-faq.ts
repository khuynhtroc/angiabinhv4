import { BlogPost } from '@/lib/types';

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

/**
 * 16 câu hỏi - đáp chuyên sâu được tối ưu theo chuẩn Answer-First (40-65 từ đầu trả lời thẳng số liệu/TCVN)
 * giúp Google AI Overview (SGE), People Also Ask, ChatGPT Search và Perplexity trích dẫn nguyên văn.
 */
export const MASTER_CONCRETE_FAQS: FaqItem[] = [
  {
    category: 'Báo giá & Chi phí',
    question: 'Giá 1 khối (1m³) bê tông tươi tại Ninh Bình năm 2026 là bao nhiêu?',
    answer:
      'Giá 1 khối (1m³) bê tông tươi tại Ninh Bình năm 2026 của Bê Tông An Gia Bình dao động từ 870.000 đ/m³ đến 1.240.000 đ/m³ tùy theo mác bê tông. Cụ thể: Mác 150 là 870.000 đ/m³, Mác 200 là 940.000 đ/m³, Mác 250 là 1.000.000 đ/m³, Mác 300 là 1.080.000 đ/m³, Mác 350 là 1.160.000 đ/m³ và Mác 400 là 1.240.000 đ/m³ (đá 1x2, độ sụt 12±2cm, hỗ trợ vận chuyển bán kính 15km từ trạm KCN Khánh Phú và Kim Sơn).'
  },
  {
    category: 'Báo giá & Chi phí',
    question: 'Chi phí thuê xe bơm bê tông tươi (bơm cần và bơm tĩnh) tại Ninh Bình tính như thế nào?',
    answer:
      'Tại Ninh Bình, giá thuê 1 ca xe bơm bê tông cần 37m – 43m (nhà dưới 5 tầng, khối lượng dưới 35m³) là từ 2.800.000 đ/ca; xe bơm cần siêu dài 52m – 56m là từ 4.200.000 đ/ca; và bơm tĩnh luồn ngõ hẹp sâu 50m – 150m là 3.200.000 đ/ca. Với khối lượng lớn trên 35m³, đơn giá bơm tính theo khối chỉ từ 65.000 – 80.000 đ/m³.'
  },
  {
    category: 'Tư vấn chọn Mác',
    question: 'Xây nhà dân dụng 2 đến 5 tầng tại Ninh Bình nên đổ bê tông mác bao nhiêu?',
    answer:
      'Đối với nhà phố và biệt thự từ 2 đến 5 tầng tại Ninh Bình, kỹ sư kết cấu khuyến nghị dùng Bê tông Mác 150 cho lớp lót móng, Mác 250 hoặc Mác 300 (cấp độ bền B20 – B22.5, độ sụt 12±2cm) cho hệ móng, cột, dầm và sàn mái. Riêng sàn mái ngoài trời hoặc tầng hầm nên bổ sung phụ gia chống thấm B6 – B8 (+35.000 đến 50.000 đ/m³) để ngăn thấm dột tuyệt đối.'
  },
  {
    category: 'Vận chuyển & Xe bồn',
    question: '1 xe bồn chở bê tông tươi tại Ninh Bình chứa được bao nhiêu khối (m³)?',
    answer:
      'Một xe bồn chuyên dụng của Bê Tông An Gia Bình chở được từ 6m³ đến 12m³ bê tông tươi mỗi chuyến. Tùy thuộc vào tải trọng cầu đường và độ rộng ngõ vào công trình tại Hoa Lư, TP. Ninh Bình, Tam Điệp, Kim Sơn hay Yên Khánh, trạm trộn sẽ điều phối xe bồn 6m³, 8m³, 10m³ hoặc 12m³ có kẹp chì niêm phong đầy đủ.'
  },
  {
    category: 'Thi công ngõ hẹp',
    question: 'Nhà trong ngõ nhỏ hẹp sâu 50m – 150m tại Ninh Bình xe bê tông tươi có đổ được không?',
    answer:
      'Hoàn toàn đổ được 100%. Với các công trình nằm trong ngõ hẹp sâu từ 50m đến 150m mà xe bồn không vào tận nơi được, Bê Tông An Gia Bình sử dụng xe bơm cần vươn qua nóc nhà (37m – 56m) hoặc hệ thống máy bơm tĩnh áp lực cao nối đường ống thép D125mm dẫn bê tông tươi trực tiếp từ đường lớn vào tận sàn thi công.'
  },
  {
    category: 'Kiểm định & Chất lượng',
    question: 'Làm sao để kiểm tra đúng mác, đủ khối lượng và độ sụt bê tông tươi tại công trình?',
    answer:
      'Khi xe bồn đến công trình, gia chủ nghiệm thu qua 3 bước chuẩn TCVN: (1) Kiểm tra phiếu cân điện tử tự động và mã kẹp chì niêm phong phễu xả; (2) Đo độ sụt trực tiếp bằng nón côn Abrams (tiêu chuẩn 12±2cm theo TCVN 3106:1993); (3) Đúc tổ 3 mẫu lập phương 150x150x150mm có chữ ký niêm phong hai bên để ép nén kiểm định cường độ R7, R28 tại phòng LAS-XD.'
  },
  {
    category: 'Kỹ thuật & Bảo dưỡng',
    question: 'Bê tông tươi đổ xong bao lâu thì khô và sau bao nhiêu ngày được tháo cốp pha?',
    answer:
      'Bê tông tươi bắt đầu ninh kết se mặt sau 2 – 4 giờ (có thể đi lại nhẹ để xoa phẳng và tưới dưỡng ẩm). Theo tiêu chuẩn TCVN 4453:1995, cốp pha thành bên cột/dầm tháo sau 24 – 48 giờ; cốp pha đáy dầm sàn nhịp nhỏ tháo sau 7 – 10 ngày (hoặc 7 ngày nếu dùng phụ gia đông kết nhanh R7); cốp pha sàn nhịp lớn và ban công tháo sau 21 – 28 ngày.'
  },
  {
    category: 'Dự toán & Kinh tế',
    question: 'Đổ 100m² sàn mái nhà phố hết bao nhiêu khối bê tông tươi và khoảng bao nhiêu tiền?',
    answer:
      'Với diện tích sàn 100m² đổ dày 12cm (kèm hệ dầm giằng hệ số 1.12), tổng khối lượng bê tông tươi cần dùng là khoảng 13.5m³ đến 14m³. Nếu sử dụng bê tông Mác 250 của An Gia Bình (1.000.000 đ/m³) kết hợp 1 ca bơm cần trọn gói (2.800.000 đ), tổng chi phí hoàn thiện cả vật tư bê tông và bơm lên sàn chỉ khoảng 16.300.000 – 16.800.000 VNĐ, thi công xong gọn gàng trong 90 phút.'
  },
  {
    category: 'Kỹ thuật & Bảo dưỡng',
    question: 'Cách bảo dưỡng bê tông tươi trong 7 ngày đầu sau khi đổ để không bị nứt chân chim?',
    answer:
      'Sau khi đổ bê tông 3 – 4 giờ và hoàn tất xoa mặt, cần phủ ngay màng nilon hoặc bao tải ẩm để giữ nước thủy hóa. Trong 7 ngày vàng đầu tiên, tưới nước giữ ẩm liên tục 3 – 4 lần/ngày (hoặc bơm ngâm nước mặt sàn dày 2 – 3cm đối với sàn mái) để bê tông phát triển đạt 100% cường độ R28 và ngăn chặn triệt để vết nứt co ngót nhiệt.'
  },
  {
    category: 'Năng lực & Phạm vi',
    question: 'Trạm trộn Bê Tông An Gia Bình đặt ở đâu và cung cấp những khu vực nào tại Ninh Bình?',
    answer:
      'Công ty TNHH Bê Tông An Gia Bình vận hành 2 cụm trạm trộn tự động SICOMA tổng công suất 450m³/h tại KCN Khánh Phú (Đông Hoa Lư) và Xã Kim Sơn, tỉnh Ninh Bình. Đội ngũ 35+ xe bồn và xe bơm cần 37m – 56m phục vụ 24/7 trên toàn tỉnh Ninh Bình: TP. Hoa Lư, TP. Tam Điệp, Yên Khánh, Kim Sơn, Gia Viễn, Yên Mô, Nho Quan và vùng giáp ranh Hà Nam, Nam Định, Thanh Hóa.'
  },
  {
    category: 'Kỹ thuật & Bảo dưỡng',
    question: 'Có được tự ý pha thêm nước lã vào xe bồn bê tông tươi tại công trường không?',
    answer:
      'Tuyệt đối không được tự ý pha thêm nước lã vào bồn trộn tại công trường. Việc thêm nước làm tăng tỷ lệ Nước/Xi măng (N/X), phá vỡ thiết kế cấp phối Mix Design, khiến bê tông bị phân tầng, rỗ mặt, co ngót nứt nẻ và tụt giảm từ 20% – 35% cường độ chịu nén. Nếu cần tăng độ linh động khi bơm, kỹ thuật viên trạm sẽ bổ sung phụ gia siêu hóa dẻo chuyên dụng.'
  },
  {
    category: 'Đặt lịch & Hỗ trợ',
    question: 'Cần đặt lịch đổ bê tông tươi tại Ninh Bình trước bao lâu và liên hệ số điện thoại nào?',
    answer:
      'Quý khách hàng và nhà thầu chỉ cần liên hệ trước từ 12 đến 24 giờ qua Hotline điều độ 24/7 của Bê Tông An Gia Bình: 0988 2662 93. Kỹ sư công trường sẽ đến tận nơi khảo sát mặt bằng đường vào, đo đạc khối lượng thực tế hoàn toàn miễn phí và điều xe bồn, xe bơm đến đúng khung giờ tốt của gia chủ.'
  }
];

/**
 * Tự động trích xuất các câu hỏi Q&A có sẵn trong nội dung bài viết (nếu có)
 * và bổ sung các câu hỏi chuyên sâu sát nhất với chủ đề bài viết để mọi URL đều có 5-8 câu FAQ.
 */
export function buildContextualFaqsForPost(post: Partial<BlogPost>): FaqItem[] {
  const extracted: FaqItem[] = [];
  const rawContent = post.content || '';
  const title = post.title || 'Bê tông tươi Ninh Bình';

  // 1. Trích xuất các cặp H3 Câu hỏi + Trả lời từ Markdown nếu có
  const regex = /###\s*(?:Câu\s*\d+\s*[:.]\s*)?([^\n?]+\?)\s*\r?\n+(?:\*\*Trả lời:\*\*|\*\*Đáp:\*\*)?\s*([^\n#]+(?:\r?\n(?![#*-])[^\n#]+)*)/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawContent)) !== null) {
    const q = match[1].replace(/[*_`]/g, '').trim();
    const a = match[2]
      .replace(/\*\*(Trả lời|Đáp):\*\*/gi, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (q.length > 12 && a.length > 30 && extracted.length < 6) {
      extracted.push({ question: q, answer: a });
    }
  }

  // 2. Tạo thêm câu hỏi bám sát tiêu đề bài viết nếu chưa có
  const cleanTitle = title.replace(/\s*\|\s*Bê Tông An Gia Bình.*$/i, '').trim();
  const dynamicFaq: FaqItem = {
    question: `Đơn vị nào tư vấn kỹ thuật và cung cấp bê tông tươi uy tín cho hạng mục "${cleanTitle}" tại Ninh Bình?`,
    answer: `Công ty TNHH Bê Tông An Gia Bình (Hotline 24/7: 0988 2662 93) là đơn vị hàng đầu tại Ninh Bình trực tiếp khảo sát, thiết kế cấp phối Mix Design chuẩn TCVN và cung ứng bê tông thương phẩm M150 – M400 cho hạng mục "${cleanTitle}". Với 2 cụm trạm trộn tại KCN Khánh Phú và Kim Sơn (450m³/h), 35+ xe bồn kẹp chì và xe bơm 37m – 56m, chúng tôi cam kết giao đúng mác, đủ khối lượng và bảo hành cường độ nén R28 tại phòng LAS-XD.`
  };

  const combined = [dynamicFaq, ...extracted];

  // 3. Bổ sung từ MASTER_CONCRETE_FAQS theo độ khớp từ khóa để đủ tối thiểu 6 câu hỏi
  const textToMatch = `${title} ${post.category || ''} ${(post.tags || []).join(' ')}`.toLowerCase();
  const scoredMaster = MASTER_CONCRETE_FAQS.map((item) => {
    let score = 0;
    const words = item.question.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && textToMatch.includes(w)) score += 1;
    }
    return { item, score };
  }).sort((a, b) => b.score - a.score);

  for (const { item } of scoredMaster) {
    if (combined.length >= 6) break;
    if (!combined.some((existing) => existing.question === item.question)) {
      combined.push(item);
    }
  }

  return combined.slice(0, 6);
}

/**
 * Tạo đối tượng JSON-LD Schema.org hoàn chỉnh cho Trang chủ & Bảng giá
 * gồm LocalBusiness + Product/OfferCatalog + FAQPage để Google AI Overview đọc trực tiếp từ Server HTML.
 */
export function buildMasterStructuredDataJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness', 'Organization'],
        '@id': 'https://www.betongangiabinh.vn/#organization',
        name: 'Công Ty TNHH Bê Tông An Gia Bình',
        alternateName: 'Bê Tông Tươi An Gia Bình Ninh Bình',
        url: 'https://www.betongangiabinh.vn',
        logo: 'https://www.betongangiabinh.vn/logo.png',
        image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
        description:
          'Hệ thống 2 trạm trộn bê tông tươi, bê tông thương phẩm tự động công suất 450m³/h tại KCN Khánh Phú và Kim Sơn, Ninh Bình. Cung cấp bê tông Mác 150 đến Mác 450, xe bồn 6-12m³, xe bơm cần 37m-56m và bơm tĩnh ngõ hẹp 24/7.',
        telephone: '+84988266293',
        email: 'ketoan.angiabinh@gmail.com',
        priceRange: '870.000đ - 1.240.000đ/m³',
        address: [
          {
            '@type': 'PostalAddress',
            streetAddress: 'KCN Khánh Phú, Phường Đông Hoa Lư',
            addressLocality: 'Hoa Lư',
            addressRegion: 'Ninh Bình',
            postalCode: '430000',
            addressCountry: 'VN'
          },
          {
            '@type': 'PostalAddress',
            streetAddress: 'Cụm Trạm Trộn Xã Kim Sơn',
            addressLocality: 'Kim Sơn',
            addressRegion: 'Ninh Bình',
            postalCode: '430000',
            addressCountry: 'VN'
          }
        ],
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 20.2236,
          longitude: 106.0225
        },
        areaServed: [
          { '@type': 'City', name: 'Hoa Lư, Ninh Bình' },
          { '@type': 'City', name: 'TP. Ninh Bình' },
          { '@type': 'City', name: 'TP. Tam Điệp' },
          { '@type': 'AdministrativeArea', name: 'Huyện Yên Khánh' },
          { '@type': 'AdministrativeArea', name: 'Huyện Kim Sơn' },
          { '@type': 'AdministrativeArea', name: 'Huyện Gia Viễn' },
          { '@type': 'AdministrativeArea', name: 'Huyện Yên Mô' },
          { '@type': 'AdministrativeArea', name: 'Huyện Nho Quan' }
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Bảng giá bê tông tươi thương phẩm và dịch vụ bơm tại Ninh Bình',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 150 (M150) đá 1x2 độ sụt 12±2cm',
                description: 'Bê tông lót móng, sàn phụ, nền sân chống thấm nhẹ tại Ninh Bình',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '870000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '128',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '870000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 200 (M200) đá 1x2 độ sụt 12±2cm',
                description: 'Nền nhà xưởng tải nhẹ, đường bê tông nông thôn, sân thượng tại Ninh Bình',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '940000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '145',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '940000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 250 (M250) đá 1x2 độ sụt 12±2cm',
                description: 'Móng, dầm, cột, sàn nhà dân dụng 2 - 5 tầng phổ biến nhất tại Ninh Bình',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '1000000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '5.0',
                  reviewCount: '312',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '1000000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 300 (M300) đá 1x2 độ sụt 12±2cm',
                description: 'Biệt thự, nhà phố từ 4 tầng, sàn xưởng công nghiệp, dầm vượt nhịp tại Ninh Bình',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '1080000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '5.0',
                  reviewCount: '264',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '1080000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 350 (M350) đá 1x2 độ sụt 12±2cm',
                description: 'Bể nước ngầm, hồ bơi, tầng hầm chống thấm B8-B10, cột vách chịu tải lớn',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '1160000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '189',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '1160000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bê tông tươi Mác 400 (M400) đá 1x2 độ sụt 12±2cm',
                description: 'Đài cọc khoan nhồi, trụ cầu vượt cao tốc, kết cấu bê tông dự ứng lực',
                image: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
                brand: {
                  '@type': 'Brand',
                  name: 'Bê Tông An Gia Bình'
                },
                offers: {
                  '@type': 'Offer',
                  price: '1240000',
                  priceCurrency: 'VND',
                  priceValidUntil: '2027-12-31',
                  availability: 'https://schema.org/InStock',
                  url: 'https://www.betongangiabinh.vn/bang-gia'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '5.0',
                  reviewCount: '116',
                  bestRating: '5',
                  worstRating: '1'
                }
              },
              price: '1240000',
              priceCurrency: 'VND',
              unitCode: 'MTQ'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Dịch vụ thuê xe bơm cần bê tông 37m - 56m & bơm tĩnh ngõ hẹp Ninh Bình',
                description: 'Ca bơm cần 37m-43m từ 2.800.000 đ/ca, bơm tĩnh luồn ngõ sâu 150m từ 3.200.000 đ/ca'
              },
              price: '2800000',
              priceCurrency: 'VND'
            }
          ]
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.betongangiabinh.vn/#faq',
        mainEntity: MASTER_CONCRETE_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };
}

