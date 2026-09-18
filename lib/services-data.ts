export interface ServiceSection {
  title: string;
  content: string;
  points?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ServiceInternalLink {
  title: string;
  href: string;
  description: string;
  badge?: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  title: string;
  categoryName: string;
  badge: string;
  heroImage: string;
  description: string;
  specifications: { label: string; value: string }[];
  applications: string[];
  advantages: string[];
  sections: ServiceSection[];
  internalLinks: ServiceInternalLink[];
  faqs: ServiceFaq[];
  parentSlug?: string;
  parentTitle?: string;
}

export const SERVICES_DATABASE: Record<string, ServiceDetail> = {
  // 1. BÊ TÔNG TƯƠI
  'be-tong-tuoi': {
    title: 'Bê Tông Tươi An Gia Bình - Phân Loại, Cấp Mác & Báo Giá Ninh Bình',
    categoryName: 'Lĩnh Vực Hoạt Động',
    badge: 'Chủ Lực Công Trình',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-3.jpg',
    description: 'Bê tông tươi (bê tông xi măng thương phẩm) An Gia Bình được sản xuất trên dây chuyền tự động hóa vi tính từ 2 cụm trạm trộn KCN Khánh Phú (300m³/h) và Kim Sơn (150m³/h). Đảm bảo cấp phối chuẩn mực TCVN 3118:1993, kiểm soát độ sụt chặt chẽ, rút ngắn thời gian thi công và đảm bảo tuổi thọ công trình.',
    specifications: [
      { label: 'Cấp mác bê tông', value: 'M150, M200, M250, M300, M350, M400, M500, M600' },
      { label: 'Độ sụt tiêu chuẩn', value: '10±2 cm (xả bồn), 12±2 cm đến 16±2 cm (đổ bơm)' },
      { label: 'Công suất trạm trộn', value: '450 m³/h từ 2 trạm trung tâm Ninh Bình' },
      { label: 'Đội xe vận chuyển', value: 'Hơn 35 xe bồn chuyên dụng bồn quay 10 - 12 m³' },
      { label: 'Hệ thống bơm cơ giới', value: 'Xe bơm cần 37m - 56m và bơm tĩnh đi xa 300m' },
      { label: 'Kiểm định chất lượng', value: 'Đúc mẫu thử tổ 3 viên, nén mẫu phòng LAS-XD' }
    ],
    applications: [
      'Đổ móng nhà dân dụng, móng băng, móng cọc khoan nhồi, móng bè biệt thự',
      'Đổ khung cột, dầm chuyển và sàn các tầng chống thấm, chống nứt',
      'Sàn nhà xưởng công nghiệp chịu tải trọng xe nâng và máy móc hạng nặng',
      'Cầu cống hộp, bờ kè đê kè sông Đáy, kênh mương thủy lợi và đường bê tông liên thôn'
    ],
    advantages: [
      'Độ đồng đều vật liệu tuyệt đối nhờ hệ thống cân điện tử tự động vi tính hóa',
      'Tiết kiệm 50% chi phí nhân công và 70% thời gian so với trộn tay thủ công',
      'Giám sát hành trình GPS và kẹp chì niêm phong xe bồn trước khi rời trạm cân',
      'Lấy mẫu kiểm định độ sụt và đúc mẫu lưu tại hiện trường trước sự chứng kiến của chủ nhà'
    ],
    sections: [
      {
        title: 'Bê Tông Tươi Là Gì? Thành Phần Cấu Tạo Chuẩn TCVN',
        content: 'Bê tông tươi là hỗn hợp gồm cát vàng tuyển chọn, đá dăm 1x2 sàng rửa sạch, xi măng PCB40 đạt chuẩn, nước sạch và các chất phụ gia hóa dẻo/chống thấm. Toàn bộ nguyên vật liệu được định lượng chuẩn xác bằng hệ thống cân điện tử tự động và trộn đều tại trạm trộn trung tâm trước khi xe bồn chuyên dụng vận chuyển đến công trường.',
        points: [
          'Xi măng: Sử dụng PCB40 từ các nhà máy uy tín (The Vissai, Duyên Hà, Vicem Tam Điệp).',
          'Cát vàng: Cát sông Lô hạt vừa và lớn, mô đun độ lớn từ 2.3 - 2.8, đã loại bỏ bùn sét.',
          'Đá dăm: Đá 1x2 tuyển chọn từ mỏ đá Ninh Bình, cường độ nén cao, độ nát thấp.',
          'Phụ gia hóa dẻo: Giảm tỷ lệ Nước/Xi măng giúp bê tông đạt độ sụt yêu cầu mà vẫn giữ cường độ cao.'
        ]
      },
      {
        title: 'Phân Loại Bê Tông Tươi Toàn Diện',
        content: 'Căn cứ vào phương pháp thi công, nhiệt độ và cấp mác chịu lực, bê tông tươi được phân loại như sau:',
        points: [
          'Theo phương pháp thi công: Bê tông tươi không lu lèn (đổ móng, dầm, cột, sàn thông qua máng xả hoặc máy bơm) và Bê tông tươi lu lèn (làm mặt đường, bãi đỗ tải nặng).',
          'Theo nhiệt độ và tính năng: Bê tông thường, Bê tông đông kết sớm R7 (tháo cốp pha sau 7 ngày), Bê tông chống thấm cấp B6 - B12, Bê tông ninh kết chậm cho khối đổ lớn.',
          'Theo cấp mác chịu nén: Mác M150, M200 (lót móng, đường nội bộ), M250, M300 (dầm cột sàn nhà phố, biệt thự), M350, M400, M500 (nhà cao tầng, móng máy công nghiệp).'
        ],
        table: {
          headers: ['Mác Bê Tông', 'Cường Độ Nén R28 (daN/cm²)', 'Độ Sụt Tiêu Chuẩn', 'Hạng Mục Khuyến Nghị'],
          rows: [
            ['M150', '150 kg/cm²', '10 ± 2 cm', 'Bê tông lót móng, sân vườn, tường rào'],
            ['M200', '200 kg/cm²', '12 ± 2 cm', 'Móng nhà cấp 4, đường bê tông ngõ xóm'],
            ['M250', '250 kg/cm²', '12 ± 2 cm / 14 ± 2 cm', 'Móng, dầm, cột, sàn nhà 2-4 tầng phổ biến'],
            ['M300', '300 kg/cm²', '14 ± 2 cm / 16 ± 2 cm', 'Biệt thự, nhà phố từ 4 tầng trở lên, sàn mái'],
            ['M350', '350 kg/cm²', '14 ± 2 cm / 16 ± 2 cm', 'Sàn nhà xưởng, móng máy rung, bể nước ngầm'],
            ['M400 - M500', '400 - 500 kg/cm²', '16 ± 2 cm', 'Dầm chuyển, móng cọc khoan nhồi công trình lớn']
          ]
        }
      },
      {
        title: 'Quy Trình Kiểm Tra Độ Sụt & Đúc Mẫu Thí Nghiệm',
        content: 'Khi xe bồn An Gia Bình đến công trường, kỹ thuật viên sẽ cùng chủ đầu tư hoặc đơn vị giám sát kiểm tra niêm phong chì, phiếu xuất xưởng ghi rõ giờ xuất trạm, mác bê tông và độ sụt. Sau đó tiến hành thử độ sụt bằng côn nón tiêu chuẩn Abrams và đúc tổ mẫu 3 viên (15x15x15cm) để nén thử cường độ tuổi 7 ngày (R7) và 28 ngày (R28) tại phòng thí nghiệm LAS-XD.'
      }
    ],
    internalLinks: [
      {
        title: 'Dịch Vụ Bơm Bê Tông Cần & Tĩnh',
        href: '/bom-be-tong',
        description: 'Bơm cần vươn xa 37m - 56m và bơm tĩnh đi xa 300m luồn lách ngõ hẹp Ninh Bình.',
        badge: 'Cơ Giới Hóa'
      },
      {
        title: 'Bê Tông Thương Phẩm An Gia Bình',
        href: '/be-tong-thuong-pham',
        description: 'Tìm hiểu sâu về quy trình sản xuất trạm trộn và kiểm soát chất lượng TCVN.',
        badge: 'Chuẩn TCVN'
      },
      {
        title: 'Bảng Giá Bê Tông Tươi Mới Nhất',
        href: '/bang-gia',
        description: 'Xem bảng báo giá chi tiết từng mác bê tông mác 150 - 450 và cước ca bơm.',
        badge: 'Báo Giá 2025'
      },
      {
        title: 'Quy Trình Sản Xuất Trạm Trộn',
        href: '/quy-trinh-san-xuat',
        description: 'Khám phá dây chuyền cân vi tính tự động từ 2 cụm trạm 450m³/h.',
        badge: 'Kỹ Thuật'
      }
    ],
    faqs: [
      {
        question: 'Thời gian vận chuyển bê tông tươi tối đa là bao lâu?',
        answer: 'Thời gian vận chuyển từ lúc nạp nguyên liệu tại trạm trộn đến khi xả bê tông vào cấu kiện tốt nhất là dưới 90 - 120 phút. Đội xe bồn An Gia Bình với 2 trạm trộn tại Khánh Phú và Kim Sơn luôn đảm bảo bán kính giao hàng trong 20 - 30 phút trên toàn tỉnh Ninh Bình.'
      },
      {
        question: 'Nên chọn mác bê tông nào cho nhà phố 3 - 4 tầng?',
        answer: 'Đối với nhà phố 3 - 4 tầng, phần móng cọc hoặc móng băng nên dùng mác M250 hoặc M300. Phần khung dầm, cột, sàn mái nên dùng mác M250 hoặc M300 để đảm bảo khả năng chịu lực lâu dài và chống thấm tốt cho mái.'
      },
      {
        question: 'Bê tông tươi An Gia Bình có kiểm định nén mẫu không?',
        answer: 'Có. Mỗi xe bồn đều có thể đúc tổ mẫu 3 viên tại hiện trường dưới sự chứng kiến của chủ nhà, dán tem niêm phong và gửi đến phòng thí nghiệm hợp chuẩn LAS-XD để nén thử cường độ R7, R28 kèm phiếu kết quả đóng dấu đỏ.'
      }
    ]
  },

  // 2. BÊ TÔNG THƯƠNG PHẨM
  'be-tong-thuong-pham': {
    title: 'Bê Tông Thương Phẩm An Gia Bình - Quy Trình Chuẩn TCVN & Năng Lực Cung Ứng',
    categoryName: 'Công Nghệ Sản Xuất',
    badge: 'Tiêu Chuẩn TCVN',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-2.jpg',
    description: 'Bê tông thương phẩm (Ready-Mixed Concrete - RMC) An Gia Bình được sản xuất công nghiệp theo công thức cấp phối tối ưu, đáp ứng trọn vẹn yêu cầu khắt khe của các nhà thầu lớn, khu công nghiệp và dự án trọng điểm.',
    specifications: [
      { label: 'Tiêu chuẩn sản xuất', value: 'TCVN 3118:1993, TCVN 9345:2012, TCVN 6260:2009' },
      { label: 'Tổng công suất', value: '450 m³/h (Trạm Khánh Phú 300m³/h + Trạm Kim Sơn 150m³/h)' },
      { label: 'Hệ thống điều khiển', value: 'Phần mềm tự động hóa PLC Siemens, cân định lượng sai số <1%' },
      { label: 'Thời gian đổ sàn', value: 'Chỉ 1 - 2 giờ cho sàn 100m² - 200m²' },
      { label: 'Đội xe vận hành', value: '35+ xe bồn 10-12m³, 10+ xe bơm cần và bơm tĩnh' },
      { label: 'Phạm vi phục vụ', value: 'TP Ninh Bình, Hoa Lư, Yên Khánh, Kim Sơn, Gia Viễn, Nho Quan, Tam Điệp' }
    ],
    applications: [
      'Công trình vốn ngân sách, trường học, bệnh viện, trụ sở cơ quan hành chính',
      'Nhà máy, nhà xưởng sản xuất trong các KCN Khánh Phú, Gián Khẩu, Tam Điệp, Phúc Sơn',
      'Khu đô thị mới, biệt thự nghỉ dưỡng Tràng An, Tam Cốc',
      'Công trình hạ tầng giao thông, cầu cống, cống hộp thủy lợi'
    ],
    advantages: [
      'Đảm bảo chất lượng ổn định tuyệt đối nhờ kiểm soát cấp phối tự động',
      'Tiết kiệm thời gian và nhân lực, giải phóng mặt bằng công trường không bụi bẩn',
      'Kiểm soát tốt độ sụt và điều chỉnh phụ gia linh hoạt theo thời tiết',
      'Hỗ trợ kỹ thuật viên giám sát lấy mẫu và đo độ sụt miễn phí tận công trình'
    ],
    sections: [
      {
        title: 'Bê Tông Thương Phẩm Là Gì? Tại Sao Nên Lựa Chọn?',
        content: 'Bê tông thương phẩm (còn gọi là bê tông trộn sẵn) là hỗn hợp gồm cốt liệu thô, cốt liệu mịn, chất kết dính xi măng, nước và phụ gia hóa học được định lượng theo tỷ lệ chính xác tại nhà máy. Khác với bê tông trộn tay truyền thống, bê tông thương phẩm An Gia Bình được sản xuất hoàn toàn trên hệ thống cối trộn cưỡng bức công suất lớn, đem lại độ dẻo và tính đồng nhất cao.',
        points: [
          'Chất lượng ổn định: Từng mẻ trộn đều được máy tính giám sát tỷ lệ cân, không phụ thuộc tay nghề xúc xẻng thủ công.',
          'Rút ngắn tiến độ: Một sàn 150m² chỉ mất 1.5 - 2 giờ bơm liên tục, giúp công trình hoàn thành trước hạn.',
          'Giảm hao hụt vật liệu: Không rơi vãi cát đá ra đường sá, bảo vệ vệ sinh môi trường khu dân cư.',
          'Tiết kiệm chi phí tổng thể: Tiết kiệm chi phí thuê nhân công khuân vác, máy trộn nhỏ và dọn dẹp mặt bằng.'
        ]
      },
      {
        title: 'Ưu Điểm & Nhược Điểm Cùng Giải Pháp Của An Gia Bình',
        content: 'Bất kỳ vật liệu xây dựng nào cũng có những đặc thù riêng, việc nắm rõ ưu nhược điểm giúp chủ đầu tư đưa ra giải pháp thi công tối ưu nhất:',
        table: {
          headers: ['Đặc Điểm', 'Bê Tông Thương Phẩm An Gia Bình', 'Bê Tông Trộn Tay Truyền Thống'],
          rows: [
            ['Độ đồng đều', 'Đồng đều tuyệt đối nhờ cân điện tử', 'Dễ chênh lệch tỷ lệ giữa các mẻ trộn'],
            ['Tốc độ đổ', '60 - 120 m³/h bằng máy bơm', 'Chỉ 3 - 5 m³/h bằng máy trộn quả lê'],
            ['Mặt bằng tập kết', 'Không cần bãi cát, đá, xi măng', 'Cần bãi chứa rộng, bụi bặm và thất thoát'],
            ['Kiểm định chất lượng', 'Có phiếu xuất xưởng và kết quả nén mẫu LAS-XD', 'Không có căn cứ kiểm định khoa học'],
            ['Thách thức ngõ nhỏ', 'Khắc phục bằng xe bồn nhỏ & đường ống bơm tĩnh 300m', 'Phải xe rùa đẩy vào ngõ gây mệt nhọc']
          ]
        }
      }
    ],
    internalLinks: [
      {
        title: 'Bê Tông Tươi Cấp Mác M150 - M600',
        href: '/be-tong-tuoi',
        description: 'Xem chi tiết các dòng bê tông thường, chống thấm, đông kết nhanh R7.',
        badge: 'Sản Phẩm'
      },
      {
        title: 'Bơm Bê Tông Cần & Tĩnh',
        href: '/bom-be-tong',
        description: 'Giải pháp đưa bê tông vào sâu trong ngõ hẻm và lên tầng cao.',
        badge: 'Thiết Bị'
      },
      {
        title: 'Hồ Sơ Năng Lực Công Ty',
        href: '/ho-so-nang-luc',
        description: 'Xem năng lực trạm trộn, chứng chỉ chất lượng và trang thiết bị thi công.',
        badge: 'Hồ Sơ'
      },
      {
        title: 'Dự Án Đã Thực Hiện',
        href: '/du-an',
        description: 'Các dự án trọng điểm tại Ninh Bình mà An Gia Bình đã cung cấp bê tông.',
        badge: 'Công Trình'
      }
    ],
    faqs: [
      {
        question: 'Trạm trộn An Gia Bình có thể cấp liên tục cho khối đổ lớn không?',
        answer: 'Có. Với 2 cụm trạm tổng công suất 450m³/h và hơn 35 xe bồn chuyên dụng, An Gia Bình thường xuyên cung cấp các mẻ đổ lớn từ 500m³ đến 2.000m³ liên tục thâu đêm cho các sàn hầm, móng bè nhà máy KCN Khánh Phú và Tam Điệp.'
      },
      {
        question: 'Xe bồn vào ngõ nhỏ Ninh Bình như thế nào?',
        answer: 'Với các công trình nhà ở trong ngõ nhỏ, An Gia Bình sẽ điều phối xe bồn kích thước gọn kết hợp máy bơm bê tông tĩnh với hệ thống đường ống thép DN125 dẫn sâu vào ngõ tới 300m.'
      }
    ]
  },

  // 3. BƠM BÊ TÔNG
  'bom-be-tong': {
    title: 'Dịch Vụ Bơm Bê Tông An Gia Bình - Xe Bơm Cần 37m-56m & Bơm Tĩnh Đi Xa 300m',
    categoryName: 'Thiết Bị Cơ Giới',
    badge: 'Đội Xe Hùng Hậu',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-1.jpg',
    description: 'Dịch vụ bơm bê tông cơ giới hóa hiện đại với đầy đủ chủng loại máy bơm cần vươn xa từ 37m đến 56m và bơm tĩnh áp lực cao đi xa 300m, đẩy cao trên 120m, giải quyết triệt để bài toán thi công nhà cao tầng và ngõ hẹp.',
    specifications: [
      { label: 'Xe bơm cần', value: 'Tầm với 37m, 42m, 48m, 52m, 56m' },
      { label: 'Xe bơm tĩnh', value: 'Đẩy cao >120m, đẩy xa >300m (ống thép DN125)' },
      { label: 'Cơ cấu vận hành', value: 'Piston thủy lực kép áp lực cao, bơm êm không tắc ống' },
      { label: 'Công suất bơm', value: '80 - 140 m³/h' },
      { label: 'Đội ngũ vận hành', value: 'Thợ bơm giàu kinh nghiệm, có chứng chỉ an toàn lao động' },
      { label: 'Khảo sát hiện trường', value: 'Khảo sát miễn phí đường dây điện và mặt bằng chân chống' }
    ],
    applications: [
      'Đổ bê tông sàn mái nhà phố cao tầng, biệt thự không gian hạn chế',
      'Đổ móng cọc khoan nhồi sâu, hầm chìm công trình công cộng',
      'Công trình trong ngõ sâu, đường làng ngõ xóm xe bồn không vào tận nơi',
      'Đổ sàn nhà xưởng diện tích rộng hàng nghìn mét vuông'
    ],
    advantages: [
      'Tiết kiệm tối đa thời gian đổ bê tông, hoàn thành sàn nhà trong 1 - 2 giờ',
      'Không làm phân tầng bê tông, dòng chảy êm và liên tục',
      'An toàn tuyệt đối với hệ thống cảm biến chân chống và cảnh báo điện cao thế',
      'Đường ống thép đúc tiêu chuẩn cao, có gioăng cao su chống xì vữa'
    ],
    sections: [
      {
        title: 'Xe Bơm Bê Tông Là Gì? Phân Loại Máy Bơm Phổ Biến',
        content: 'Xe bơm bê tông là thiết bị cơ giới chuyên dụng có nhiệm vụ vận chuyển hỗn hợp bê tông tươi từ phễu xe bồn tới vị trí đổ chính xác trên công trình thông qua hệ thống đường ống dẫn chịu áp lực lớn. Hiện nay An Gia Bình vận hành 2 dòng máy bơm chủ lực:',
        points: [
          'Bơm bê tông cần (bơm động): Xe tự hành gắn cần bơm thủy lực gấp khúc 4 - 5 đốt, có thể vươn qua ngọn cây, dây điện dân sinh hoặc đổ thẳng lên sàn tầng 3, tầng 5 mà không cần lắp ống phụ.',
          'Bơm bê tông tĩnh (bơm ngang): Máy bơm cố định nối với hệ thống đường ống thép DN125 lắp ghép linh hoạt, luồn lách qua ngõ nhỏ ngách sâu hoặc dẫn lên nhà cao tầng trên 30 tầng.',
          'Cơ cấu Piston thủy lực: Đảm bảo áp lực đẩy cực mạnh, hút nhả nhịp nhàng và tránh hiện tượng nghẹt đá.'
        ]
      },
      {
        title: 'Báo Giá Dịch Vụ Cho Thuê Xe Bơm Tham Khảo',
        content: 'Đơn giá thuê xe bơm phụ thuộc vào loại bơm (cần hay tĩnh) và khối lượng bê tông cần bơm trong một ca:',
        table: {
          headers: ['Loại Máy Bơm', 'Khối Lượng Ca Chuẩn', 'Đơn Giá Ca Chuẩn', 'Đơn Giá Vượt Khối (Sau 30m³)'],
          rows: [
            ['Bơm cần 37m - 42m', 'Dưới 30 m³/ca', '2.500.000 - 3.000.000 đ/ca', '65.000 - 75.000 đ/m³'],
            ['Bơm cần 48m - 56m', 'Dưới 40 m³/ca', '3.500.000 - 4.500.000 đ/ca', '80.000 - 95.000 đ/m³'],
            ['Bơm tĩnh đường ống ngắn (<50m)', 'Dưới 30 m³/ca', '2.800.000 - 3.200.000 đ/ca', '70.000 - 80.000 đ/m³'],
            ['Bơm tĩnh đường ống dài (50m - 150m)', 'Dưới 30 m³/ca', '3.500.000 - 4.200.000 đ/ca', '85.000 - 100.000 đ/m³']
          ]
        }
      }
    ],
    internalLinks: [
      {
        title: 'Bê Tông Tươi Trạm Trộn Ninh Bình',
        href: '/be-tong-tuoi',
        description: 'Đặt trọn gói bê tông tươi kèm xe bơm để nhận mức chiết khấu tốt nhất.',
        badge: 'Ưu Đãi'
      },
      {
        title: 'Bê Tông Thương Phẩm Mác 150 - 450',
        href: '/be-tong-thuong-pham',
        description: 'Tìm hiểu tiêu chuẩn cấp phối mác bê tông thương phẩm chất lượng cao.',
        badge: 'Tiêu Chuẩn'
      },
      {
        title: 'Bảng Giá Chi Tiết Ca Bơm',
        href: '/bang-gia',
        description: 'Cập nhật bảng giá ca bơm cần và bơm tĩnh mới nhất năm 2025.',
        badge: 'Bảng Giá'
      },
      {
        title: 'Liên Hệ Khảo Sát Hiện Trường',
        href: '/lien-he',
        description: 'Đăng ký kỹ thuật viên khảo sát mặt bằng và đường dây điện miễn phí.',
        badge: 'Hỗ Trợ'
      }
    ],
    faqs: [
      {
        question: 'Trước khi bơm bê tông cần chuẩn bị những gì?',
        answer: 'Chủ nhà cần dọn dẹp mặt bằng để xe bơm ra chân chống chữ X (rộng khoảng 6m - 8m), kiểm tra hành lang đường dây điện trên không và chuẩn bị sẵn nguồn nước sạch để súc rửa đường ống sau khi bơm xong.'
      },
      {
        question: 'Ngõ sâu 100m xe bồn không vào được thì bơm như thế nào?',
        answer: 'An Gia Bình sử dụng máy bơm bê tông tĩnh đặt ngoài ngõ rộng, sau đó công nhân lắp ghép hệ thống đường ống thép DN125 dài 100m chạy dọc theo ngõ vào tận công trình để bơm bê tông một cách êm ái, sạch sẽ.'
      }
    ]
  },

  // 4. BÊ TÔNG SIÊU NHẸ
  'be-tong-sieu-nhe': {
    title: 'Bê Tông Siêu Nhẹ An Gia Bình - Tấm Panel Cách Âm, Chống Nóng & Giảm Tải 60%',
    categoryName: 'Vật Liệu Tiên Tiến',
    badge: 'Cách Nhiệt & Giảm Tải',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-5.jpg',
    description: 'Tấm bê tông siêu nhẹ (Panel bê tông nhẹ EPS / bọt khí) cốt thép gia cường là giải pháp mang tính cách mạng, giảm tới 60% tải trọng nền móng, cách âm chống ồn tuyệt hảo và thi công lắp ghép siêu nhanh.',
    specifications: [
      { label: 'Tỷ trọng thể tích', value: '600 - 900 kg/m³ (nhẹ hơn 1/3 bê tông thường)' },
      { label: 'Khả năng cách âm', value: 'Giảm 38 - 45 dB' },
      { label: 'Hệ số dẫn nhiệt', value: '0.11 - 0.14 W/m.K (cách nhiệt gấp 6 lần gạch nung)' },
      { label: 'Khả năng chống cháy', value: 'Đạt cấp EI 120 - EI 180 (chịu >1000°C trong 3 giờ)' },
      { label: 'Quy cách kích thước', value: '1200x600, 2400x600, 3000x600 mm; dày 50, 75, 100, 150 mm' },
      { label: 'Cốt thép gia cường', value: 'Thép cường độ cao mạ kẽm chống rỉ bên trong' }
    ],
    applications: [
      'Cải tạo, nâng tầng nhà phố cũ, cơi nới phòng không cần gia cố thêm móng',
      'Làm sàn chịu lực lắp ghép thay thế đổ bê tông sàn truyền thống',
      'Làm tường bao, vách ngăn văn phòng, nhà xưởng khung thép tiền chế',
      'Khu vực đất yếu ven sông Đáy, Yên Khánh, Kim Sơn cần giảm tải trọng kết cấu'
    ],
    advantages: [
      'Trọng lượng siêu nhẹ, giảm tải trọng tĩnh lên dầm cột và nền móng',
      'Cách âm, cách nhiệt chống nóng vượt trội, giảm tiền điện điều hòa mùa hè',
      'Kháng nước, chống ẩm mốc tuyệt đối, không bị mục nát khi ngập ẩm',
      'Tốc độ lắp ghép ngàm âm dương nhanh gấp 3 - 4 lần xây trát gạch đỏ'
    ],
    sections: [
      {
        title: 'Tấm Bê Tông Siêu Nhẹ Là Gì? Cấu Trúc & Trọng Lượng',
        content: 'Tấm bê tông siêu nhẹ là vật liệu composite được cấu tạo từ xi măng cường độ cao, cát mịn tuyển chọn, nước, phụ gia nở tạo bọt khí hoặc hạt xốp EPS (Expanded Polystyrene). Lõi tấm được đan 1 đến 2 lớp lưới thép chống rỉ, tạo khả năng chịu uốn và chịu lực va đập tuyệt vời. Trọng lượng thể tích chỉ dao động từ 600 - 900 kg/m³, nhẹ hơn bê tông thông thường (2400 kg/m³) tới 3 - 4 lần.',
        points: [
          'Giảm tải trọng móng: Rất phù hợp cho các khu vực nền đất yếu tại Ninh Bình hoặc công trình cơi nới thêm tầng.',
          'Cách âm 38 - 45 dB: Tạo không gian sống yên tĩnh, lý tưởng cho phòng ngủ, phòng hát, khách sạn, nhà trọ.',
          'Cách nhiệt ưu việt: Ngăn chặn nhiệt lượng bức xạ mặt trời, giữ không khí trong nhà luôn mát mẻ vào mùa hè.',
          'Kháng nước và chống cháy: Không bén lửa, không sinh khói độc, chịu nước tốt mà không bị biến dạng.'
        ]
      },
      {
        title: 'Bảng Kích Thước & Báo Giá Tham Khảo',
        content: 'Tùy theo chiều dày và quy cách tấm, giá tấm bê tông siêu nhẹ dao động từ 225.000đ - 360.000đ/m²:',
        table: {
          headers: ['Quy Cách Tấm (Dài x Rộng x Dày)', 'Trọng Lượng (kg/tấm)', 'Ứng Dụng Khuyến Nghị', 'Đơn Giá Tham Khảo'],
          rows: [
            ['1200 x 600 x 75 mm', '~32 kg', 'Vách ngăn nội thất, tường cách âm', '225.000 - 250.000 đ/m²'],
            ['1200 x 600 x 100 mm', '~42 kg', 'Tường bao ngoài trời, vách chống cháy', '260.000 - 290.000 đ/m²'],
            ['2400 x 600 x 100 mm', '~85 kg', 'Làm sàn gác lửng, sàn nâng tầng nhẹ', '290.000 - 320.000 đ/m²'],
            ['2400 x 600 x 150 mm', '~125 kg', 'Sàn chịu tải trọng xe máy, nhà kho nhẹ', '340.000 - 380.000 đ/m²']
          ]
        }
      }
    ],
    internalLinks: [
      {
        title: 'Bê Tông Khí Chưng Áp AAC / ALC',
        href: '/be-tong-khi-chung-ap',
        description: 'Khám phá gạch nhẹ chưng áp và tấm panel ALC chuẩn công nghệ Thụy Điển.',
        badge: 'Công Nghệ Xanh'
      },
      {
        title: 'Bê Tông Tươi Đổ Móng & Khung Cột',
        href: '/be-tong-tuoi',
        description: 'Kết hợp kết cấu móng bê tông tươi vững chắc cùng tường sàn nhẹ.',
        badge: 'Vật Liệu Cốt Lõi'
      },
      {
        title: 'Bảng Giá Vật Liệu Mới Nhất',
        href: '/bang-gia',
        description: 'Xem chi tiết đơn giá từng quy cách tấm và phụ kiện lắp ghép chuyên dụng.',
        badge: 'Bảng Giá'
      }
    ],
    faqs: [
      {
        question: 'Tấm bê tông nhẹ có bị thấm nước khi làm tường ngoài trời không?',
        answer: 'Tấm bê tông siêu nhẹ có cấu trúc bọt khí kín không mao dẫn, khả năng chống thấm tự nhiên rất cao. Khi lắp đặt tường ngoài trời, thợ sẽ xử lý mối nối ngàm âm dương bằng keo chuyên dụng và dán lưới chống nứt, đảm bảo chống thấm tuyệt đối.'
      },
      {
        question: 'Có thể treo đồ nặng (tivi, tủ bếp) lên tường bê tông nhẹ không?',
        answer: 'Hoàn toàn được. Sử dụng vít nở chuyên dụng cho bê tông nhẹ có thể chịu tải trọng treo điểm lên tới 50 - 80 kg/điểm, thoải mái treo tivi màn hình lớn, tủ bếp hoặc bình nóng lạnh.'
      }
    ]
  },

  // 5. BÊ TÔNG NHỰA
  'be-tong-nhua': {
    title: 'Bê Tông Nhựa Nóng Asphalt An Gia Bình - Phân Loại, Định Mức & Thi Công Thảm Mặt Đường',
    categoryName: 'Hạ Tầng Giao Thông',
    badge: 'Chuyên Nghiệp',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-6.jpg',
    description: 'Bê tông nhựa nóng (Hot Mix Asphalt - HMA) An Gia Bình được sản xuất trên trạm trộn liên tục hiện đại, phục vụ thảm mới và nâng cấp mặt đường quốc lộ, tỉnh lộ, khu đô thị và sân bãi logistics tại Ninh Bình.',
    specifications: [
      { label: 'Chủng loại hạt', value: 'Hạt mịn C9.5, Hạt trung C12.5, Hạt thô C19 / C25' },
      { label: 'Nhiệt độ trộn xuất xưởng', value: '140°C - 170°C' },
      { label: 'Nhiệt độ rải & lu lèn', value: 'Lớn hơn 110°C - 130°C' },
      { label: 'Độ chặt lu lèn', value: 'Đạt độ chặt K ≥ 0.98' },
      { label: 'Độ rỗng dư', value: '3% - 6% theo tiêu chuẩn Bộ GTVT' },
      { label: 'Độ ổn định Marshall', value: '≥ 8 kN' }
    ],
    applications: [
      'Mặt đường giao thông quốc lộ, tỉnh lộ và tuyến đường tránh TP Ninh Bình',
      'Đường nội bộ các khu công nghiệp Gián Khẩu, Khánh Phú, Tam Điệp',
      'Đường giao thông nông thôn mới, đường đô thị, khu dân cư kiểu mẫu',
      'Bãi đỗ xe trung tâm thương mại, khu du lịch Tràng An, Tam Cốc, Bái Đính'
    ],
    advantages: [
      'Bề mặt phẳng êm thuận, giảm thiểu tiếng ồn bánh xe và ma sát tốt',
      'Thời gian thông xe cực nhanh, phương tiện lưu thông ngay sau khi nguội',
      'Khả năng chống trượt, thoát nước mặt tốt trong điều kiện mưa bão',
      'Tuổi thọ cao, dễ dàng cào bóc vá dặm và tái sinh bảo trì'
    ],
    sections: [
      {
        title: 'Bê Tông Nhựa Là Gì? Phân Loại Chi Tiết',
        content: 'Bê tông nhựa là vật liệu xây dựng làm lớp mặt đường giao thông, phối trộn giữa đá dăm (đá 1x2, đá mi sàng, đá mi bụi), cát, nhựa đường đặc 60/70 và bột khoáng ở nhiệt độ cao. Hiện nay bê tông nhựa chiếm trên 70% hệ thống giao thông tại Việt Nam nhờ độ êm thuận và bền bỉ.',
        points: [
          'Phân loại theo phương pháp thi công: Bê tông nhựa lu lèn (dùng lu rung và lu bánh lốp đạt độ chặt K>=0.98) và Bê tông nhựa không lu lèn (mastic đúc rót tự san).',
          'Phân loại theo nhiệt độ: Bê tông nhựa nóng (trộn ở 140 - 170°C), Bê tông nhựa ấm (110 - 130°C tiết kiệm năng lượng) và Bê tông nhựa nguội (Cold mix vá dặm ổ gà).',
          'Phân loại theo kích cỡ hạt: Hạt mịn C9.5 (lớp mặt trên dày 3-5cm), Hạt trung C12.5 (lớp mặt dày 5-7cm), Hạt thô C19 / C25 (lớp móng dưới chịu tải xe nặng).'
        ]
      },
      {
        title: 'Quy Trình Thi Công Rải Thảm Chuẩn Kỹ Thuật',
        content: 'Quy trình thi công bê tông nhựa An Gia Bình tuân thủ nghiêm ngặt tiêu chuẩn TCVN 8819:2011:',
        points: [
          'Bước 1: Làm sạch mặt đường bằng máy thổi bụi công nghiệp áp lực cao.',
          'Bước 2: Tưới nhựa dính bám (Tack Coat) nhũ tương tiêu chuẩn 0.5 kg/m².',
          'Bước 3: Vận chuyển bê tông nhựa bằng xe tải bạt che giữ nhiệt trên 130°C.',
          'Bước 4: Rải thảm bằng máy rải lu lèn bánh xích tự động, kiểm soát độ dày đồng đều.',
          'Bước 5: Lu lèn sơ bộ bằng lu sắt rung, tiếp theo bằng lu lốp 16 tấn để đạt độ chặt K ≥ 0.98.'
        ]
      }
    ],
    internalLinks: [
      {
        title: 'Dự Án Giao Thông & Hạ Tầng Tiêu Biểu',
        href: '/du-an',
        description: 'Xem các dự án hạ tầng giao thông và khu công nghiệp đã hoàn thành.',
        badge: 'Dự Án'
      },
      {
        title: 'Bê Tông Thương Phẩm Cho Cầu Cống',
        href: '/be-tong-thuong-pham',
        description: 'Cung cấp bê tông thương phẩm cho hạng mục cống hộp, móng mố cầu.',
        badge: 'Cốt Lõi'
      },
      {
        title: 'Bảng Giá Thi Công Bê Tông Nhựa',
        href: '/bang-gia',
        description: 'Tra cứu giá rải thảm bê tông nhựa nóng theo m² và theo tấn.',
        badge: 'Bảng Giá'
      }
    ],
    faqs: [
      {
        question: 'Sau khi rải thảm bê tông nhựa nóng bao lâu thì thông xe được?',
        answer: 'Thông thường sau khi lu lèn hoàn tất và mặt đường nguội tự nhiên về dưới 50°C (khoảng 2 - 4 giờ tùy theo nhiệt độ môi trường) là có thể cho các phương tiện giao thông lưu thông bình thường.'
      }
    ]
  },

  // 6. BÊ TÔNG KHÍ CHƯNG ÁP
  'be-tong-khi-chung-ap': {
    title: 'Bê Tông Khí Chưng Áp AAC / ALC An Gia Bình - Gạch Không Nung & Tấm Panel Tiêu Chuẩn',
    categoryName: 'Lĩnh Vực Hoạt Động',
    badge: 'Công Nghệ Tiên Tiến',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-4.jpg',
    description: 'Vật liệu không nung xanh thân thiện với môi trường, được sản xuất theo công nghệ chưng áp hơi nước bão hòa nhiệt độ cao. Cung cấp gạch AAC và tấm panel bê tông khí ALC có cốt thép chống rỉ, đẩy nhanh tốc độ thi công gấp 3 lần.',
    specifications: [
      { label: 'Tên quốc tế', value: 'AAC (Autoclaved Aerated Concrete) & Panel ALC' },
      { label: 'Tỷ trọng khô', value: '500 - 700 kg/m³ (nổi trên mặt nước)' },
      { label: 'Cường độ nén', value: '3.5 - 5.0 MPa (Gạch), 4.0 - 7.5 MPa (Panel ALC)' },
      { label: 'Khả năng chống cháy', value: 'Đạt cấp chống cháy A1, chịu 1200°C suốt 4 - 8 giờ' },
      { label: 'Hệ số dẫn nhiệt', value: '0.11 - 0.14 W/m.K (cách nhiệt gấp 6 lần gạch đỏ)' },
      { label: 'Kích thước chuẩn', value: 'Gạch 600x200x100/150/200mm; Panel dài tới 4.8m' }
    ],
    applications: [
      'Xây tường bao ngoài và tường ngăn chia phòng căn hộ cao ốc, khách sạn',
      'Lắp dựng sàn và vách ngăn chống cháy cho nhà xưởng công nghiệp KCN',
      'Nâng tầng nhà phố, cơi nới không cần gia cố thêm hệ thống móng cột',
      'Công trình yêu cầu cách âm cao như bệnh viện, trường học, rạp chiếu phim'
    ],
    advantages: [
      'Trọng lượng siêu nhẹ chỉ bằng 1/4 gạch đỏ đặc truyền thống',
      'Cách nhiệt và chống cháy hoàn hảo, giảm chi phí làm mát 40%',
      'Bề mặt phẳng mịn tuyệt đối, tiết kiệm 70% vữa trát hoàn thiện',
      'Vật liệu xanh bảo vệ môi trường, không phát thải khí nhà kính'
    ],
    sections: [
      {
        title: 'Nguồn Gốc Xuất Xứ & Khái Niệm Bê Tông Khí Chưng Áp',
        content: 'Bê tông khí chưng áp (AAC) được phát minh vào những năm 1920 bởi kiến trúc sư Thụy Điển Johan Axel Eriksson nhằm thay thế gạch đất sét nung gây ô nhiễm môi trường và suy giảm tài nguyên đất. Sau hơn 100 năm phát triển, AAC đã trở thành vật liệu xây dựng chủ đạo tại Châu Âu, Nhật Bản và đang phát triển mạnh mẽ tại Việt Nam.',
        points: [
          'AAC (Autoclaved Aerated Concrete): Gạch nhẹ chưng áp tạo hình dạng khối đúc sẵn, kích thước lớn gấp 8-12 lần gạch đỏ.',
          'ALC (Autoclaved Lightweight Concrete): Tấm panel nhẹ có lõi lưới thép chống rỉ kép bên trong, chuyên dùng lót sàn và ốp vách.',
          'Quy trình chưng áp: Hấp trong nồi autoclave hơi nước bão hòa áp suất 12 atm ở nhiệt độ 180°C - 200°C trong 12 giờ tạo cấu trúc tinh thể khoáng Tobermorite siêu bền vững.'
        ]
      },
      {
        title: 'So Sánh Gạch Khí Chưng Áp AAC Với Gạch Đỏ Truyền Thống',
        content: 'Bảng đối chiếu các chỉ số kỹ thuật quan trọng giữa 2 loại vật liệu:',
        table: {
          headers: ['Tiêu Chí So Sánh', 'Bê Tông Khí Chưng Áp AAC', 'Gạch Đất Sét Nung Truyền Thống'],
          rows: [
            ['Trọng lượng thể tích', '500 - 700 kg/m³ (nổi trên nước)', '1600 - 1800 kg/m³ (rất nặng)'],
            ['Khả năng chống cháy', 'Chịu nhiệt >1200°C suốt 4 - 8 giờ', 'Chịu nhiệt 1 - 2 giờ, dễ nứt toác'],
            ['Hệ số cách nhiệt', '0.11 - 0.14 W/m.K (cực tốt)', '0.70 - 0.81 W/m.K (hút nhiệt mạnh)'],
            ['Tốc độ xây tường', 'Nhanh gấp 3 lần (kích thước lớn)', 'Chậm chạp, tốn nhiều nhân công'],
            ['Lượng vữa trát', 'Chỉ dùng vữa mỏng 2 - 3mm', 'Cần lớp vữa dày 15 - 20mm']
          ]
        }
      }
    ],
    internalLinks: [
      {
        title: 'Tấm Bê Tông Siêu Nhẹ EPS',
        href: '/be-tong-sieu-nhe',
        description: 'So sánh tính năng với tấm panel bê tông nhẹ hạt xốp EPS.',
        badge: 'Vật Liệu Nhẹ'
      },
      {
        title: 'Bê Tông Tươi Khung Cột Chịu Lực',
        href: '/be-tong-tuoi',
        description: 'Kết hợp khung dầm cột bê tông tươi với tường gạch nhẹ AAC.',
        badge: 'Cốt Lõi'
      },
      {
        title: 'Báo Giá Gạch AAC & Panel ALC',
        href: '/bang-gia',
        description: 'Tra cứu giá gạch block và tấm panel theo m² và mét khối.',
        badge: 'Bảng Giá'
      }
    ],
    faqs: [
      {
        question: 'Xây gạch AAC có cần ngâm nước như gạch đỏ không?',
        answer: 'Không. Gạch AAC sử dụng vữa xây chuyên dụng gốc xi măng polymer mỏng, tuyệt đối không ngâm nước trước khi xây để tránh làm loãng độ bám dính của keo xây.'
      }
    ]
  },

  // Sub-services
  'be-tong-tuoi/be-tong-thuong': {
    title: 'Bê Tông Tươi Thường (Mác 150, 200, 250, 300)',
    categoryName: 'Bê Tông Tươi',
    badge: 'Phổ Biến Nhất',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-3.jpg',
    parentSlug: '/be-tong-tuoi',
    parentTitle: 'Bê Tông Tươi',
    description: 'Dòng sản phẩm bê tông tươi tiêu chuẩn mác M150, M200, M250, M300 sử dụng cốt liệu cát vàng hạt lớn sông Lô, đá dăm 1x2 tuyển rửa sạch và xi măng chuẩn TCVN. Phù hợp tuyệt đối cho nhà dân dụng, biệt thự phố, móng, dầm, cột, sàn mái.',
    specifications: [
      { label: 'Mác bê tông', value: 'M150, M200, M250, M300' },
      { label: 'Độ sụt tiêu chuẩn', value: '12±2 cm (xả máng), 14±2 cm (bơm cần)' },
      { label: 'Cốt liệu sử dụng', value: 'Đá 1x2 sạch, Cát vàng hạt vừa-lớn, Xi măng PCB40' },
      { label: 'Thời gian ninh kết', value: 'Bắt đầu: 2-3 giờ; Kết thúc: 6-8 giờ' },
      { label: 'Tuổi thiết kế', value: 'R28 (đạt 100% cường độ sau 28 ngày)' }
    ],
    applications: [
      'Đổ móng nhà phố, móng cọc khoan nhồi, móng băng biệt thự',
      'Đổ cột trụ, khung bê tông cốt thép chịu lực',
      'Đổ sàn các tầng và mái chống nứt'
    ],
    advantages: [
      'Độ dẻo cao, dễ đầm dùi, bề mặt sau khi tháo dỡ ván khuôn bóng đẹp',
      'Cấp phối chuẩn xác bằng hệ thống cân điện tử tự động trạm trộn',
      'Đảm bảo không bị phân tầng, rỗ tổ ong'
    ],
    sections: [
      {
        title: 'Đặc Tính Kỹ Thuật & Cấp Phối Bê Tông Tươi Thông Thường',
        content: 'Bê tông tươi thông thường An Gia Bình (mác M150, M200, M250, M300) là dòng vật liệu chủ lực được sử dụng cho hơn 80% các công trình nhà ở gia đình, biệt thự phố và nhà xưởng công nghiệp tại Ninh Bình. Toàn bộ hỗn hợp được phối trộn bằng hệ thống cân điện tử vi tính hóa, kiểm soát chặt chẽ tỷ lệ cốt liệu cát vàng, đá dăm 1x2, xi măng PCB40 và nước.',
        points: [
          'Đá dăm 1x2 tuyển chọn sàng rửa sạch, cường độ nén cao, loại bỏ tạp chất và đất sét.',
          'Cát vàng sông Lô hạt vừa và lớn (mô đun độ lớn 2.4 - 2.8), không lẫn phù sa hay muối mặn.',
          'Xi măng PCB40 chất lượng cao từ các nhà máy Duyên Hà, The Vissai, Vicem Tam Điệp.',
          'Độ sụt ổn định: 10±2 cm (đổ máng xả trực tiếp) hoặc 12±2 cm đến 14±2 cm (đổ bơm cần/bơm tĩnh).'
        ],
        table: {
          headers: ['Mác Bê Tông', 'Cường Độ Thiết Kế R28', 'Độ Sụt Khuyến Nghị', 'Hạng Mục Ứng Dụng'],
          rows: [
            ['Mác 150', '150 kg/cm² (15 MPa)', '10 ± 2 cm', 'Bê tông lót móng, láng sân vườn, nền nhà kho'],
            ['Mác 200', '200 kg/cm² (20 MPa)', '12 ± 2 cm', 'Móng nhà cấp 4, tường rào, đường liên thôn'],
            ['Mác 250', '250 kg/cm² (25 MPa)', '12 ± 2 cm / 14 ± 2 cm', 'Móng, dầm, cột, sàn mái nhà phố 2 - 4 tầng'],
            ['Mác 300', '300 kg/cm² (30 MPa)', '14 ± 2 cm / 16 ± 2 cm', 'Biệt thự cao cấp, dầm vượt nhịp, sàn nhà xưởng']
          ]
        }
      },
      {
        title: 'Quy Trình Kiểm Tra Độ Sụt & Bảo Dưỡng Sau Khi Đổ',
        content: 'Mỗi xe bồn An Gia Bình trước khi xả bê tông đều được kỹ thuật viên hỗ trợ chủ nhà kiểm tra niêm phong kẹp chì, đo độ sụt bằng côn Abrams tiêu chuẩn và đúc tổ mẫu 3 viên (15x15x15cm) có dán tem xác nhận tại chỗ. Sau khi đổ, công trình cần được bảo dưỡng giữ ẩm liên tục trong 7 ngày đầu để tránh rạn nứt bề mặt do bốc hơi nước nhanh.',
        points: [
          'Tưới nước giữ ẩm hoặc phủ bao bố ướt/nilon kín sau khi mặt bê tông se cứng (khoảng 4 - 6 giờ sau đổ).',
          'Tưới nước 2 - 3 lần/ngày vào ban ngày nắng nóng trong 3 ngày đầu tiên.',
          'Không chất tải nặng hay tháo cốp pha chịu lực trước thời hạn thiết kế (tối thiểu 21 - 28 ngày đối với bê tông thường).'
        ]
      }
    ],
    internalLinks: [
      { title: 'Bê Tông Tươi Tổng Thể', href: '/be-tong-tuoi', description: 'Xem tổng quan phân loại và báo giá mác 150 - 600.', badge: 'Tổng Quan' },
      { title: 'Bê Tông Chống Thấm (B6 - B12)', href: '/be-tong-tuoi/be-tong-chong-tham', description: 'Dành riêng cho sàn mái lộ thiên, tầng hầm và bể nước ngầm.', badge: 'Đặc Biệt' },
      { title: 'Dịch Vụ Xe Bơm Bê Tông', href: '/bom-be-tong', description: 'Xe bơm cần 37m - 56m và bơm tĩnh đi xa 300m luồn lách ngõ hẹp.', badge: 'Cơ Giới' },
      { title: 'Bê Tông Thương Phẩm An Gia Bình', href: '/be-tong-thuong-pham', description: 'Quy trình sản xuất trạm trộn vi tính tự động hóa.', badge: 'Trạm Trộn' }
    ],
    faqs: [
      {
        question: 'Nhà dân 2 - 3 tầng nên chọn bê tông mác 200 hay mác 250?',
        answer: 'Với nhà dân 2 - 3 tầng, An Gia Bình khuyến nghị sử dụng bê tông mác 250 (M250) cho toàn bộ phần kết cấu chịu lực: móng, cột, dầm và sàn mái. Mác 250 đảm bảo độ an toàn chịu lực lâu dài, hạn chế tối đa rạn nứt và có mật độ bê tông đặc chắc hơn so với mác 200.'
      },
      {
        question: 'Bê tông thường cần tháo dỡ ván khuôn sau bao nhiêu ngày?',
        answer: 'Với bê tông tươi thông thường sử dụng xi măng PCB40 không có phụ gia đông kết sớm, thời gian tháo dỡ ván khuôn cột vách là 24 - 48 giờ. Riêng cốp pha đáy dầm và sàn phải đợi đủ 21 đến 28 ngày để bê tông đạt trên 85% - 100% cường độ thiết kế R28.'
      }
    ]
  },

  'be-tong-tuoi/be-tong-chong-tham': {
    title: 'Bê Tông Tươi Chống Thấm (Cấp B6, B8, B10, B12)',
    categoryName: 'Bê Tông Tươi',
    badge: 'Công Nghệ Đặc Biệt',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-2.jpg',
    parentSlug: '/be-tong-tuoi',
    parentTitle: 'Bê Tông Tươi',
    description: 'Bê tông tươi chống thấm cao cấp tích hợp phụ gia giảm nước, phụ gia kỵ nước và phụ gia trương nở tinh thể thẩm thấu. Cấu trúc bê tông cực kỳ đặc chắc, ngăn chặn triệt để nước và ion clo xâm thực, bảo vệ cốt thép vĩnh cửu.',
    specifications: [
      { label: 'Cấp chống thấm', value: 'B6, B8, B10, B12 (Áp lực nước 6 - 12 atm)' },
      { label: 'Cường độ tương ứng', value: 'Từ M250, M300, M350 đến M400' },
      { label: 'Độ sụt yêu cầu', value: '14±2 cm đến 16±2 cm' },
      { label: 'Phụ gia đặc chủng', value: 'Sika Viscocrete hoặc MasterSeal thẩm thấu tinh thể' },
      { label: 'Thí nghiệm kiểm định', value: 'Thử áp lực nước thẩm thấu theo TCVN 3116:1993' }
    ],
    applications: [
      'Tầng hầm, vách hầm công trình ngầm chịu áp lực nước ngầm lớn',
      'Bể chứa nước sinh hoạt, bể bơi, hố ga xử lý nước thải',
      'Sàn mái sân thượng, sê nô hứng nước mưa lộ thiên'
    ],
    advantages: [
      'Kháng nước tuyệt đối từ bên trong khối bê tông, không lo bong tróc',
      'Tự hàn gắn các vết nứt tế vi dưới 0.4mm nhờ tinh thể kết tinh hoạt tính',
      'Tăng độ bền chống ăn mòn cho kết cấu cốt thép bên trong'
    ],
    sections: [
      {
        title: 'Cơ Chế Chống Thấm Toàn Khối Của Bê Tông Cấp B6 - B12',
        content: 'Bê tông chống thấm An Gia Bình đạt được khả năng kháng nước vượt trội nhờ phối hợp 3 cơ chế: (1) Cắt giảm tối đa tỷ lệ Nước/Xi măng bằng phụ gia siêu dẻo thế hệ mới, (2) Lấp đầy toàn bộ vi mao quản rỗng trong lòng khối bê tông bằng tinh thể khoáng siêu mịn, (3) Phụ gia kỵ nước làm tăng góc tiếp xúc của giọt nước, ngăn nước thẩm thấu qua thành mao dẫn ngay cả dưới áp lực nước ngầm từ 6 đến 12 atmosphere.',
        points: [
          'Cấp B6: Chịu áp lực nước 6 atm (~60m cột nước), khuyên dùng cho sàn mái, ban công, nhà vệ sinh.',
          'Cấp B8: Chịu áp lực nước 8 atm (~80m cột nước), khuyên dùng cho vách hầm, móng ngập nước, bể ngầm.',
          'Cấp B10 - B12: Chịu áp lực 10 - 12 atm, khuyên dùng cho hầm chìm sâu, bể chứa hóa chất, đập thủy lợi.'
        ],
        table: {
          headers: ['Cấp Chống Thấm', 'Mác Bê Tông Đi Kèm', 'Áp Lực Nước Tối Đa', 'Vị Trí Thi Công Khuyến Nghị'],
          rows: [
            ['Chống thấm B6', 'M250 - M300', '6 atm (0.6 MPa)', 'Sàn mái lộ thiên, máng thoát nước sê-nô'],
            ['Chống thấm B8', 'M300 - M350', '8 atm (0.8 MPa)', 'Tầng hầm 1 tầng, bể nước sinh hoạt, hố pít thang máy'],
            ['Chống thấm B10', 'M350 - M400', '10 atm (1.0 MPa)', 'Tầng hầm sâu 2-3 tầng, đài móng ven sông hồ'],
            ['Chống thấm B12', 'M400 trở lên', '12 atm (1.2 MPa)', 'Công trình ngầm đặc biệt, hầm thủy điện, trạm bơm']
          ]
        }
      },
      {
        title: 'Lưu Ý Thi Công Bê Tông Chống Thấm Không Bị Nứt Mạch Ngừng',
        content: 'Để phát huy tối đa hiệu quả chống thấm, quá trình đổ bê tông phải liên tục không tạo mạch ngừng nguội. Ở các điểm giao giữa đáy móng và vách hầm bắt buộc phải đặt băng cản nước Waterstop PVC hoặc gioăng cao su trương nở Hydrotite, kết hợp đầm dùi kỹ lưỡng để không bị rỗ bọt khí chân tường.',
        points: [
          'Đầm dùi đều tay theo bước đầm 1.5 lần bán kính tác dụng, không đầm quá lâu gây phân tầng.',
          'Sử dụng băng cản nước PVC chuyên dụng tại tất cả các mối nối mạch ngừng vách hầm.',
          'Bảo dưỡng ngâm nước hoặc giữ ẩm liên tục tối thiểu 10 - 14 ngày sau khi đổ.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Bê Tông Tươi Ninh Bình', href: '/be-tong-tuoi', description: 'Khám phá tất cả các mác bê tông và bảng giá trạm trộn.', badge: 'Tổng Quan' },
      { title: 'Bê Tông Cường Độ Cao R7', href: '/be-tong-tuoi/be-tong-chat-luong-cao', description: 'Giải pháp tháo cốp pha nhanh sau 7 ngày kết hợp chống thấm.', badge: 'Rút Ngắn Tiến Độ' },
      { title: 'Dịch Vụ Bơm Bê Tông', href: '/bom-be-tong', description: 'Đội xe bơm cần và bơm tĩnh đưa bê tông vào tầng hầm sâu.', badge: 'Bơm Bê Tông' },
      { title: 'Bảng Báo Giá Bê Tông', href: '/bang-gia', description: 'Xem chi phí phụ gia chống thấm B6, B8, B10, B12 chi tiết.', badge: 'Báo Giá' }
    ],
    faqs: [
      {
        question: 'Đổ bê tông chống thấm B8 có cần quét thêm màng chống thấm bên ngoài không?',
        answer: 'Bản thân bê tông chống thấm B8 đã ngăn nước tuyệt đối xuyên qua khối bê tông. Tuy nhiên, tại các khe co giãn, mạch ngừng thi công hoặc góc chân tường tiếp giáp nền đất ẩm, bạn nên kết hợp dán thêm màng chống thấm hoặc quét lớp chống thấm chuyên dụng để tạo thành hệ thống bảo vệ kép bền vững trọn đời công trình.'
      },
      {
        question: 'Chi phí bê tông chống thấm chênh lệch bao nhiêu so với bê tông thường?',
        answer: 'Bê tông chống thấm cấp B6 đến B8 thường có đơn giá cộng thêm khoảng 70.000đ - 110.000đ/m³ tùy theo loại phụ gia sử dụng (phụ gia chống thấm bề mặt hoặc tinh thể thẩm thấu). Đây là khoản đầu tư rất nhỏ nhưng loại bỏ hoàn toàn nguy cơ thấm dột tốn hàng chục triệu sửa chữa sau này.'
      }
    ]
  },

  'be-tong-tuoi/be-tong-chat-luong-cao': {
    title: 'Bê Tông Tươi Cường Độ Cao (Mác R7 & M400 - M600)',
    categoryName: 'Bê Tông Tươi',
    badge: 'Chuyên Dụng',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-1.jpg',
    parentSlug: '/be-tong-tuoi',
    parentTitle: 'Bê Tông Tươi',
    description: 'Bê tông tươi chất lượng cao ứng dụng phụ gia siêu dẻo thế hệ mới và muội silic (Silica Fume), đạt mác nén siêu cao M400 - M600 hoặc phát triển cường độ sớm R7, rút ngắn chu kỳ tháo cốp pha xuống chỉ còn 7 ngày.',
    specifications: [
      { label: 'Cường độ chịu nén', value: 'M400, M450, M500, M600 (R28)' },
      { label: 'Thời gian tháo cốp pha', value: 'Chỉ 7 ngày (đối với bê tông mác R7)' },
      { label: 'Tỷ lệ Nước / Xi măng (W/C)', value: 'Rất thấp, chỉ từ 0.28 - 0.35' },
      { label: 'Độ linh động', value: 'Độ chảy xòe Slump Flow 550 - 650 mm' }
    ],
    applications: [
      'Cột vách chịu tải trọng cực lớn của nhà cao tầng',
      'Dầm chuyển nhịp lớn, sàn ứng lực trước căng sau',
      'Móng máy cơ khí nặng, mố trụ cầu vượt'
    ],
    advantages: [
      'Đẩy nhanh tiến độ thi công gấp 2 lần, quay vòng cốp pha nhanh',
      'Cấu trúc siêu đặc chắc, khả năng chịu mài mòn và xâm thực cao',
      'Bảo hành chất lượng bằng văn bản kiểm định LAS-XD'
    ],
    sections: [
      {
        title: 'Bê Tông Đông Kết Sớm R7 & Bê Tông Siêu Cao M400 - M600',
        content: 'Bê tông chất lượng cao An Gia Bình được phát triển dành riêng cho các dự án đòi hỏi tiến độ thi công thần tốc hoặc các kết cấu chịu lực cực hạn như dầm cầu vượt, cột trụ nhà cao tầng, sàn dự ứng lực. Nhờ sử dụng xi măng mác cao kết hợp phụ gia siêu dẻo gốc polycarboxylate cao cấp, bê tông đạt 75% - 85% cường độ thiết kế chỉ sau 7 ngày (R7), cho phép tháo dỡ ván khuôn sớm mà vẫn tuyệt đối an toàn kết cấu.',
        points: [
          'Bê tông R7: Đạt cường độ thiết kế sau 7 ngày thay vì phải chờ đủ 28 ngày như bê tông thường.',
          'Bê tông mác cao M400, M450, M500, M600: Cường độ nén từ 40 đến 60 MPa, chuyên dụng cho cột trụ chịu lực lớn và dầm vượt nhịp.',
          'Kiểm soát nhiệt độ thủy hóa: Giữ nhiệt độ khối đổ ở mức an toàn, hạn chế tối đa rạn nứt nhiệt.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Bê Tông Ninh Kết Chậm', href: '/be-tong-tuoi/be-tong-ninh-ket-cham', description: 'Cho khối đổ lớn và móng bè quy mô khủng.', badge: 'Khối Lớn' },
      { title: 'Bê Tông Thương Phẩm Chuẩn TCVN', href: '/be-tong-thuong-pham', description: 'Năng lực trạm trộn tự động 450m³/h của An Gia Bình.', badge: 'Năng Lực' },
      { title: 'Dịch Vụ Bơm Bê Tông Cần & Tĩnh', href: '/bom-be-tong', description: 'Xe bơm cần 37m - 56m chuyên trị nhà cao tầng.', badge: 'Xe Bơm' },
      { title: 'Bảng Giá Bê Tông Mác Cao', href: '/bang-gia', description: 'Tra cứu báo giá bê tông mác 400 - 500 và phụ gia R7.', badge: 'Bảng Giá' }
    ],
    faqs: [
      {
        question: 'Tháo cốp pha sau 7 ngày bằng bê tông R7 có làm võng sàn không?',
        answer: 'Không. Bê tông R7 của An Gia Bình được cấp phối để sau 7 ngày tuổi đạt tối thiểu 75% - 85% cường độ R28 thiết kế. Mức cường độ này vượt xa ngưỡng yêu cầu chịu lực theo TCVN 4453:1995 đối với việc tháo dỡ ván khuôn, hoàn toàn không gây võng hay nứt sàn.'
      }
    ]
  },

  'be-tong-tuoi/be-tong-ninh-ket-cham': {
    title: 'Bê Tông Tươi Ninh Kết Chậm (Đổ Khối Lớn Chống Nứt)',
    categoryName: 'Bê Tông Tươi',
    badge: 'Kỹ Thuật Cao',
    heroImage: '/images/dich-vu/be-tong-an-gia-binh-5.jpg',
    parentSlug: '/be-tong-tuoi',
    parentTitle: 'Bê Tông Tươi',
    description: 'Bê tông tươi tích hợp phụ gia làm chậm quá trình thủy hóa xi măng, kéo dài thời gian đông kết từ 4 đến 8 tiếng. Chuyên dụng cho các khối đổ bê tông thể tích lớn, thi công trong thời tiết mùa hè nắng gắt hoặc vận chuyển đường xa.',
    specifications: [
      { label: 'Thời gian bắt đầu đông kết', value: 'Kéo dài từ 4 - 8 giờ tùy theo yêu cầu' },
      { label: 'Mác bê tông áp dụng', value: 'M250, M300, M350, M400' },
      { label: 'Phụ gia làm chậm', value: 'Phụ gia loại D hoặc G theo ASTM C494' },
      { label: 'Nhiệt độ khối đổ', value: 'Kiểm soát chênh lệch nhiệt độ trong và ngoài < 20°C' }
    ],
    applications: [
      'Đài móng bè khối tích lớn trên 500m³ - 2000m³',
      'Đập tràn, tường chắn đất, trụ cầu khối lớn',
      'Đổ bê tông liên tục vào ban ngày mùa hè nắng nóng trên 38°C'
    ],
    advantages: [
      'Ngăn ngừa triệt để hiện tượng nứt do co ngót nhiệt thủy hóa',
      'Tránh tạo mạch ngừng thi công khi đổ bê tông khối tích lớn',
      'Duy trì độ sụt ổn định suốt quá trình vận chuyển và bơm xả'
    ],
    sections: [
      {
        title: 'Giải Pháp Đổ Bê Tông Khối Lớn Không Nứt Do Nhiệt Thủy Hóa',
        content: 'Khi thi công các khối bê tông thể tích lớn (như đài móng bè nhà máy, mố trụ cầu vượt, sàn tầng hầm diện tích rộng), quá trình thủy hóa xi măng tỏa ra lượng nhiệt khổng lồ, khiến nhiệt độ tâm khối đổ có thể tăng vọt lên trên 65°C - 75°C. Nếu chênh lệch nhiệt độ giữa tâm khối và mặt ngoài vượt quá 20°C, ứng suất kéo sinh ra sẽ xé toạc kết cấu bê tông. Bê tông ninh kết chậm An Gia Bình sử dụng phụ gia điều tiết thủy hóa thông minh, giải phóng nhiệt lượng từ từ và kéo dài thời gian đông kết.',
        points: [
          'Kéo dài thời gian bắt đầu đông kết từ 4 đến 8 giờ, cho phép bơm xả liên tục các mẻ lớn mà không sợ hình thành mạch ngừng lạnh.',
          'Giảm đỉnh nhiệt độ thủy hóa xi măng từ 10°C - 15°C, triệt tiêu nguy cơ nứt nhiệt co ngót.',
          'Duy trì độ sụt ổn định trong điều kiện thời tiết mùa hè nhiệt độ ngoài trời lên tới 40°C.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Bê Tông Tươi Toàn Diện', href: '/be-tong-tuoi', description: 'Các dòng sản phẩm bê tông tươi của An Gia Bình.', badge: 'Sản Phẩm' },
      { title: 'Bê Tông Thương Phẩm Dự Án', href: '/be-tong-thuong-pham', description: 'Cung cấp mẻ đổ liên tục 500m³ - 2000m³ cho nhà máy KCN.', badge: 'Dự Án' },
      { title: 'Bơm Bê Tông Công Suất Lớn', href: '/bom-be-tong', description: 'Bơm cần 56m và bơm tĩnh áp lực cao bơm thâu đêm.', badge: 'Xe Bơm' },
      { title: 'Báo Giá Trạm Trộn 2025', href: '/bang-gia', description: 'Tra cứu giá bê tông tươi và phụ gia ninh kết chậm.', badge: 'Báo Giá' }
    ],
    faqs: [
      {
        question: 'Khi nào công trình bắt buộc phải dùng bê tông ninh kết chậm?',
        answer: 'Công trình nên dùng bê tông ninh kết chậm khi: (1) Khối đổ có chiều dày từ 0.8m trở lên (đài móng bè, mố cầu), (2) Khối lượng bê tông lớn đòi hỏi thời gian đổ kéo dài trên 4 - 6 giờ, (3) Khoảng cách vận chuyển từ trạm trộn đến công trường xa hoặc thời tiết mùa hè nắng gắt nhiệt độ cao.'
      }
    ]
  }
};

export const SLUG_ALIASES: Record<string, string> = {
  'be-tong-thuong': 'be-tong-tuoi/be-tong-thuong',
  'be-tong-chong-tham': 'be-tong-tuoi/be-tong-chong-tham',
  'be-tong-chat-luong-cao': 'be-tong-tuoi/be-tong-chat-luong-cao',
  'be-tong-ninh-ket-cham': 'be-tong-tuoi/be-tong-ninh-ket-cham',
};
