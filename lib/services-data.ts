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
  },
  // 11. BÊ TÔNG TƯƠI TP NINH BÌNH
  'be-tong-tuoi-tp-ninh-binh': {
    title: 'Bê Tông Tươi TP Ninh Bình - Trạm Trộn Cấp Mác 150 - 400 & Xe Bơm 52m',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Trung Tâm Tỉnh Lỵ',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80',
    description: 'Cung cấp bê tông tươi thương phẩm tại toàn bộ 14 phường, xã Thành phố Ninh Bình (Đông Thành, Nam Thành, Phúc Thành, Bích Đào, Vân Giang, Nam Bình, Ninh Khánh, Ninh Phong, KĐT Xuân Thành, KĐT Phúc Sơn). Cự ly vận chuyển chỉ 15 - 25 phút từ Trạm trộn KCN Khánh Phú.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M150, M200, M250, M300, M350, M400 chuẩn TCVN' },
      { label: 'Cự ly trạm trộn', value: '5 - 12 km từ Cụm trạm đôi KCN Khánh Phú' },
      { label: 'Thời gian giao hàng', value: '15 - 25 phút từ lúc xuất xưởng' },
      { label: 'Đội xe phục vụ', value: '35+ xe bồn bồn quay 10 - 12m³' },
      { label: 'Xe bơm cơ giới', value: 'Xe bơm cần 37m - 56m & Bơm tĩnh luồn ngõ 150m' },
      { label: 'Hotline điều độ', value: '0988 2662 93 (Kỹ sư trực 24/7)' }
    ],
    applications: [
      'Đổ móng bè, dầm sàn, cột biệt thự tân cổ điển KĐT Xuân Thành & Phúc Sơn',
      'Đổ sàn nhà ống, nhà phố liền kề các tuyến đường Lê Hồng Phong, Trần Hưng Đạo',
      'Giải pháp bơm tĩnh vượt ngõ hẹp cho các khu phố cổ Vân Giang, Bích Đào',
      'Đổ sàn showroom, khách sạn, nhà hàng trung tâm thành phố'
    ],
    advantages: [
      'Bê tông luôn tươi nguyên nhờ cự ly vận chuyển siêu ngắn dưới 25 phút',
      'Đo độ sụt nón côn Abrams và đúc 3 tổ mẫu lưu nghiệm thu trực tiếp',
      'Kẹp chì niêm phong xe bồn tuyệt đối chống lái xe pha nước làm loãng mác',
      'Hỗ trợ khảo sát mặt bằng, dây điện và đường ngõ hoàn toàn miễn phí'
    ],
    sections: [
      {
        title: 'Năng Lực Cung Ứng Bê Tông Tươi Tại Thành Phố Ninh Bình',
        content: 'Với vị trí chiến lược của Cụm trạm trộn KCN Khánh Phú (công suất 300m³/h) nằm ngay sát cửa ngõ phía Đông Nam TP Ninh Bình, Bê Tông An Gia Bình cam kết điều độ xe bồn liên tục chỉ sau 15 đến 20 phút chạy xe. Đội ngũ kỹ sư hiện trường luôn sẵn sàng khảo sát đường dây điện, độ rộng ngõ và mặt bằng đỗ chân xe bơm cần.',
        points: [
          'Phục vụ nhanh chóng các phường: Đông Thành, Nam Thành, Phúc Thành, Bích Đào, Thanh Bình, Vân Giang, Nam Bình, Ninh Khánh, Ninh Phong, Ninh Tiến, Ninh Phúc, Ninh Nhất.',
          'Hỗ trợ xin cấp phép lưu hành xe bồn ban ngày tại các tuyến phố cấm tải theo quy định.',
          'Bơm tĩnh chuyên dụng nối ống luồn sâu tới 150m cho các ngõ hẹp chỉ rộng từ 1.8m đến 2.5m.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Ninh Bình', href: '/bang-gia', description: 'Bảng giá mác 200 - 350 mới nhất.', badge: 'Báo Giá' },
      { title: 'Bê Tông Tươi Toàn Diện', href: '/be-tong-tuoi', description: 'Các dòng sản phẩm bê tông thương phẩm.', badge: 'Sản Phẩm' },
      { title: 'Dịch Vụ Xe Bơm Bê Tông', href: '/bom-be-tong', description: 'Xe bơm cần 37m - 56m và bơm tĩnh.', badge: 'Xe Bơm' },
      { title: 'Quy Trình Kiểm Định LAS-XD', href: '/quy-trinh-san-xuat', description: 'Tiêu chuẩn nén mẫu R7, R28.', badge: 'Chất Lượng' }
    ],
    faqs: [
      {
        question: 'Nhà tôi ở phố cổ Vân Giang ngõ chỉ rộng 2m thì xe bê tông có đổ được không?',
        answer: 'Hoàn toàn đổ được. An Gia Bình sử dụng dàn xe bơm tĩnh áp lực cao đỗ ngoài đường lớn và nối đường ống thép luồn qua ngõ sâu tới 150m, rót bê tông tận chân công trình an toàn và sạch sẽ.'
      }
    ]
  },

  // 12. BÊ TÔNG TƯƠI TAM ĐIỆP
  'be-tong-tuoi-tam-diep': {
    title: 'Bê Tông Tươi Tam Điệp - Cung Cấp Mác Chuẩn TCVN & Xe Bơm Vượt Địa Hình Dốc',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Đô Thị Phía Tây',
    heroImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
    description: 'Trạm trộn bê tông tươi cung ứng khắp Thành phố Tam Điệp: Bắc Sơn, Nam Sơn, Trung Sơn, Tây Sơn, Yên Bình, Tân Bình, Quang Sơn, Đông Sơn, KCN Tam Điệp 1 & 2. Cấp phối mác chuẩn TCVN, phụ gia chống nứt phù hợp địa hình đồi dốc.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M150, M200, M250, M300, M350, M400' },
      { label: 'Cự ly trạm trộn', value: '18 - 25 km qua QL1A hoặc đường tránh' },
      { label: 'Khu công nghiệp', value: 'Phục vụ KCN Tam Điệp 1, KCN Tam Điệp 2' },
      { label: 'Địa hình phục vụ', value: 'Vượt dốc đồi, đường đèo sườn núi đá vôi' },
      { label: 'Đội xe cơ giới', value: 'Xe bồn công suất lớn & Bơm cần 43m - 56m' },
      { label: 'Hotline 24/7', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng và sàn nhà xưởng cơ khí, may mặc tại KCN Tam Điệp',
      'Đổ biệt thự đồi, nhà vườn nghỉ dưỡng tại Quang Sơn, Đông Sơn',
      'Đổ móng nhà phố kiên cố trên nền đất đồi sét sỏi son',
      'Đổ đường bê tông đồi, kè chắn đất chống sạt lở'
    ],
    advantages: [
      'Phụ gia duy trì độ sụt ổn định suốt cung đường vận chuyển Tam Điệp',
      'Xe bơm cần chân nhện bám dốc an toàn trên địa hình đồi cao',
      'Cung ứng liên tục các ca đổ móng khối lớn 300m³ - 1000m³',
      'Đầy đủ hóa đơn VAT và chứng chỉ xuất xưởng cho dự án'
    ],
    sections: [
      {
        title: 'Giải Pháp Thi Công Bê Tông Thương Phẩm Tại Thành Phố Tam Điệp',
        content: 'Tam Điệp có nền địa chất đồi gạch bazan và đá vôi già rất vững chắc, thuận lợi cho kết cấu móng nông. Tuy nhiên, việc thi công trên các sườn dốc đòi hỏi xe bồn có động cơ khỏe và xe bơm cần có hệ thống chân chống thủy lực vững chãi. Bê Tông An Gia Bình đáp ứng đầy đủ các tiêu chuẩn kỹ thuật an toàn cao nhất.',
        points: [
          'Điều độ xe bồn liên tục dọc tuyến Quốc Lộ 1A và đường cao tốc Mai Sơn.',
          'Cấp phối bê tông đặc thù mác 250, 300 chống co ngót nhiệt khi đổ nắng gió đồi.',
          'Hỗ trợ đúc mẫu và nén mẫu nghiệm thu theo tiêu chuẩn TCVN 3118:1993.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Tam Điệp', href: '/bang-gia', description: 'Đơn giá bê tông tươi và ca bơm Tam Điệp.', badge: 'Báo Giá' },
      { title: 'Bê Tông Tươi Toàn Diện', href: '/be-tong-tuoi', description: 'Phân loại các mác bê tông xây dựng.', badge: 'Sản Phẩm' },
      { title: 'Dự Án Tiêu Biểu Ninh Bình', href: '/du-an', description: 'Các công trình đã thi công tại Tam Điệp.', badge: 'Dự Án' }
    ],
    faqs: [
      {
        question: 'Công trình của tôi ở sườn đồi Quang Sơn thì xe bơm có lên được không?',
        answer: 'Được. Chúng tôi có dàn xe bơm cần và bơm tĩnh chuyên dụng dẫn động 2 cầu, dễ dàng tiếp cận và đỗ chân an toàn trên các sườn đồi dốc tại Tam Điệp.'
      }
    ]
  },

  // 13. BÊ TÔNG TƯƠI KIM SƠN
  'be-tong-tuoi-kim-son': {
    title: 'Bê Tông Tươi Kim Sơn - Cụm Trạm Trộn 150m³/h & Bê Tông Chống Thấm B8 Vùng Nước Lợ',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Cụm Trạm Trung Tâm',
    heroImage: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&auto=format&fit=crop&q=80',
    description: 'Nhà máy bê tông An Gia Bình cơ sở Kim Sơn công suất 150m³/h phục vụ toàn bộ 25 xã, thị trấn huyện Kim Sơn (Phát Diệm, Bình Minh, Cồn Thoi, Kim Đông, Kim Trung, Định Hóa, Như Hòa, Quang Thiện, Đồng Hướng). Chuyên giải pháp móng bè trên nền đất yếu và bê tông chống thấm mặn B6 - B10.',
    specifications: [
      { label: 'Cụm trạm sản xuất', value: 'Trạm trộn tự động An Gia Bình Xã Kim Sơn' },
      { label: 'Công suất thiết kế', value: '150 m³/h vận hành điều khiển vi tính' },
      { label: 'Cự ly vận chuyển', value: 'Chỉ 5 - 15 phút tới trung tâm các xã Kim Sơn' },
      { label: 'Đặc tính bê tông', value: 'Tích hợp phụ gia chống thấm B6, B8 kháng mặn' },
      { label: 'Đội xe túc trực', value: '15 xe bồn chuyên dụng bồn 10m³ thường trực' },
      { label: 'Hotline điều độ', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng bè, đài giằng chống lún lệch cho nhà phố trên nền đất trũng Kim Sơn',
      'Bê tông đổ bể nước ăn ngầm, bể phốt tự hoại chống thấm ngược nước lợ',
      'Đổ sàn nhà thờ giáo xứ, trường học, bệnh viện, nhà nuôi chim yến',
      'Bê tông công trình thủy lợi, cống ngăn mặn, đê kè ven biển Kim Đông'
    ],
    advantages: [
      'Khoảng cách siêu gần giúp bê tông tươi nguyên, không lo đông kết dọc đường',
      'Cấp phối xi măng bền sunfat kháng muối mặn cho vùng ven biển',
      'Đội ngũ thợ lắp đường ống bơm tĩnh luồn sâu vào các làng nghề truyền thống',
      'Đo độ sụt nón côn và đúc mẫu nghiệm thu tận chân công trình'
    ],
    sections: [
      {
        title: 'Giải Pháp Kết Cấu Bê Tông Vùng Đất Trũng Ven Biển Kim Sơn',
        content: 'Địa chất Kim Sơn có lớp bùn sét phù sa bồi lắng dày và mực nước ngầm nông nhiễm mặn nhẹ. Nếu sử dụng bê tông trộn tay thủ công, chất lượng không đồng đều sẽ gây lún nứt móng và rỉ sét cốt thép chỉ sau vài năm. Trạm trộn Kim Sơn của An Gia Bình ứng dụng cấp phối mác 250 - 300 kết hợp phụ gia chống thấm tinh thể thẩm thấu B8 giúp bảo vệ công trình bền bỉ trăm năm.',
        points: [
          'Giao bê tông tận nơi các xã ven biển: Cồn Thoi, Kim Mỹ, Kim Tân, Kim Hải, Kim Trung, Kim Đông.',
          'Hỗ trợ bơm tĩnh luồn sâu vào các xóm đạo, làng nghề chiếu cói đường ngõ hẹp.',
          'Cam kết đủ khối lượng, kẹp chì minh bạch, nén mẫu R28 tại phòng LAS-XD.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Kim Sơn', href: '/bang-gia', description: 'Đơn giá trực tiếp từ Trạm Kim Sơn.', badge: 'Báo Giá' },
      { title: 'Bê Tông Chống Thấm B8', href: '/be-tong-tuoi', description: 'Giải pháp chống thấm bể ngầm & móng.', badge: 'Kỹ Thuật' },
      { title: 'Liên Hệ Điều Xe Bồn Kim Sơn', href: '/lien-he', description: 'Hotline đặt lịch đổ sàn 24/7.', badge: 'Liên Hệ' }
    ],
    faqs: [
      {
        question: 'Tại Kim Sơn xây nhà 3 tầng nên đổ mác bao nhiêu để không bị lún nứt?',
        answer: 'Tại Kim Sơn đất yếu, bạn nên đổ mác M250 hoặc M300 cho hệ móng bè dày 35 - 40cm có dầm sườn cao 60 - 70cm, đồng thời tích hợp phụ gia chống thấm B6 để bảo vệ cốt thép khỏi nước ngầm phèn mặn.'
      }
    ]
  },

  // 14. BÊ TÔNG TƯƠI YÊN KHÁNH
  'be-tong-tuoi-yen-khanh': {
    title: 'Bê Tông Tươi Yên Khánh - Cung Ứng Siêu Tốc 20 Phút Từ Trạm KCN Khánh Phú',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Địa Bàn Trọng Điểm',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    description: 'Trạm trộn bê tông tươi phục vụ toàn huyện Yên Khánh: Thị trấn Ninh, Khánh Hòa, Khánh An, Khánh Phú, Khánh Cư, Khánh Hải, Khánh Tiên, Khánh Thiện, Khánh Lợi, Khánh Nhạc, Khánh Hồng, Khánh Mậu, Khánh Hội. Thời gian giao hàng chỉ từ 15 đến 25 phút.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M150, M200, M250, M300, M350' },
      { label: 'Cự ly xuất trạm', value: 'Chỉ 3 - 15 km từ Trạm KCN Khánh Phú' },
      { label: 'Thời gian có mặt', value: '15 - 20 phút sau khi gọi xe' },
      { label: 'Cụm công nghiệp', value: 'Phục vụ KCN Khánh Phú, CCN Khánh Nhạc' },
      { label: 'Xe bơm phục vụ', value: 'Bơm cần 37m - 52m và Bơm tĩnh 120m' },
      { label: 'Hotline đặt hàng', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng và dầm sàn nhà phố dân dụng Thị trấn Ninh & các xã Yên Khánh',
      'Đổ sàn nhà xưởng may mặc, chế biến nông sản CCN Khánh Nhạc',
      'Đổ cọc ép bê tông, móng bè cho vùng đất phù sa ven sông Đáy',
      'Đổ đường giao thông nông thôn mới và kênh mương nội đồng'
    ],
    advantages: [
      'Trạm trộn nằm ngay trên địa bàn huyện (KCN Khánh Phú) nên cước vận chuyển rẻ nhất',
      'Điều độ xe bồn siêu tốc, không bao giờ bị trễ giờ hoàng đạo của chủ nhà',
      'Cát vàng sông Lô hạt lớn sàng tuyển sạch bùn sét',
      'Đo độ sụt nón côn và đúc 3 viên mẫu nén lưu nghiệm thu'
    ],
    sections: [
      {
        title: 'Lợi Thế Cung Ứng Bê Tông Tươi Tại Huyện Yên Khánh',
        content: 'Nằm kề bên Trạm trộn trung tâm Khánh Phú công suất 300m³/h, khách hàng tại Yên Khánh luôn nhận được mức đơn giá bê tông tươi ưu đãi nhất tỉnh Ninh Bình do tiết kiệm tối đa cước phí vận chuyển. Đoàn xe bồn và xe bơm cần cơ động qua các tuyến đường ĐT480, ĐT481 nhanh chóng.',
        points: [
          'Giao hàng đúng hẹn 100% cho mọi công trình đổ sàn sáng sớm hoặc ca đêm.',
          'Bê tông đạt chuẩn TCVN 3105:1993 và TCVN 4453:1995.',
          'Hỗ trợ kỹ thuật đo đạc bóc tách mét khối bê tông miễn phí tại nhà.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Yên Khánh', href: '/bang-gia', description: 'Đơn giá mác 250 rẻ nhất Yên Khánh.', badge: 'Báo Giá' },
      { title: 'Quy Trình Kiểm Định LAS', href: '/quy-trinh-san-xuat', description: 'Nghiệm thu chất lượng mẻ trộn.', badge: 'Chất Lượng' },
      { title: 'Dự Án Đã Đổ Tại Yên Khánh', href: '/du-an', description: 'Các công trình tiêu biểu huyện Yên Khánh.', badge: 'Dự Án' }
    ],
    faqs: [
      {
        question: 'Đặt bê tông ở Yên Khánh có được miễn phí ca bơm không?',
        answer: 'Với các công trình khối lượng từ 50m³ trở lên tại Yên Khánh, Bê Tông An Gia Bình có chính sách chiết khấu giảm giá đặc biệt cho ca xe bơm cần hoặc hỗ trợ tiền ống bơm tĩnh.'
      }
    ]
  },

  // 15. BÊ TÔNG TƯƠI GIA VIỄN
  'be-tong-tuoi-gia-vien': {
    title: 'Bê Tông Tươi Gia Viễn - Phục Vụ Thị Trấn Me, KCN Gián Khẩu & Đê Sông Hoàng Long',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Phía Bắc Tỉnh',
    heroImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    description: 'Cung cấp bê tông thương phẩm tại Huyện Gia Viễn: Thị trấn Me, Gia Trấn, Gia Tân, Gia Thanh, Gia Xuân, Gia Hòa, Gia Lập, Gia Vượng, Gia Phương, Gia Thắng, Gia Tiến, Gia Trung, CCN Gia Vân, CCN Gia Phú, KCN Gián Khẩu.',
    specifications: [
      { label: 'Cấp mác bê tông', value: 'M150, M200, M250, M300, M350, M400' },
      { label: 'Tuyến đường cơ động', value: 'Quốc Lộ 1A, ĐT477, đường đê sông Hoàng Long' },
      { label: 'Khu công nghiệp', value: 'KCN Gián Khẩu, CCN Gia Vân, CCN Gia Phú' },
      { label: 'Đội xe vận chuyển', value: 'Xe bồn 10 - 12m³ vượt đường đê an toàn' },
      { label: 'Xe bơm bê tông', value: 'Bơm cần 37m - 56m vươn xa' },
      { label: 'Hotline kỹ thuật', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ sàn nhà xưởng phụ tùng ô tô, may mặc KCN Gián Khẩu',
      'Đổ móng và sàn nhà dân dụng Thị trấn Me & các xã Gia Viễn',
      'Đổ kè đê, trạm bơm tiêu úng mùa mưa lũ vùng trũng Gia Viễn',
      'Đổ công trình văn hóa, đền chùa, khu nghỉ dưỡng du lịch'
    ],
    advantages: [
      'Đội ngũ tài xế thông thuộc đường đê và cầu cống huyện Gia Viễn',
      'Kiểm soát thời gian vận chuyển dưới 45 phút giữ trọn độ dẻo',
      'Hỗ trợ xe bơm cần vươn xa vượt qua hành lang đê kè',
      'Kiểm định chất lượng tại hiện trường có kẹp chì niêm phong'
    ],
    sections: [
      {
        title: 'Cung Cấp Bê Tông Thương Phẩm Dự Án & Dân Dụng Tại Gia Viễn',
        content: 'Gia Viễn có các cụm công nghiệp trọng điểm như KCN Gián Khẩu và các khu dân cư trũng dọc lưu vực sông Hoàng Long. Bê Tông An Gia Bình chuyên cung ứng bê tông tươi đạt chuẩn chịu lực cao và phụ gia chống thấm cho các công trình hạ tầng và nhà ở gia đình.',
        points: [
          'Cấp phối tối ưu mác 250 - 350 cho nhà xưởng tải nặng.',
          'Hỗ trợ đúc mẫu nén thí nghiệm LAS-XD bàn giao chủ đầu tư.',
          'Điều độ xe bồn nhịp nhàng không để ngắt quãng dòng bê tông.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Gia Viễn', href: '/bang-gia', description: 'Đơn giá mác bê tông tươi tại Gia Viễn.', badge: 'Báo Giá' },
      { title: 'Bơm Bê Tông Công Suất Cao', href: '/bom-be-tong', description: 'Dàn xe bơm cần 37m - 56m.', badge: 'Xe Bơm' }
    ],
    faqs: [
      {
        question: 'Xe bồn bê tông có đi qua được đường đê sông Hoàng Long không?',
        answer: 'Được. Chúng tôi bố trí các dòng xe bồn tải trọng phù hợp với quy định tải trọng mặt đê Gia Viễn, đảm bảo an toàn đê điều và giao hàng đúng tiến độ.'
      }
    ]
  },

  // 16. BÊ TÔNG TƯƠI NHO QUAN
  'be-tong-tuoi-nho-quan': {
    title: 'Bê Tông Tươi Nho Quan - Cung Cấp Mác Cao & Bơm Tĩnh Vượt Địa Hình Đồi Núi',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Miền Núi Phía Tây',
    heroImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80',
    description: 'Bê tông thương phẩm tại Huyện Nho Quan: Thị trấn Nho Quan, Đồng Phong, Lạng Phong, Quảng Lạc, Yên Quang, Văn Phú, Gia Thủy, Gia Lâm, Gia Tường, Sơn Lai, Quỳnh Lưu, Phú Long. Bơm tĩnh nối ống luồn sâu thôn xóm đồi dốc.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M150, M200, M250, M300, M350' },
      { label: 'Cung đường phục vụ', value: 'QL12B, ĐT477, đường liên huyện Nho Quan' },
      { label: 'Đặc thù công trình', value: 'Nhà dân, trang trại, biệt thự sườn đồi, kè đá' },
      { label: 'Giải pháp ngõ hẹp', value: 'Bơm tĩnh nối ống thép luồn thôn bản 150m' },
      { label: 'Hotline tư vấn', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng và dầm sàn nhà phố Thị trấn Nho Quan, Đồng Phong',
      'Đổ đường bê tông trang trại, resort sinh thái Cúc Phương',
      'Đổ móng cột điện cao thế, trạm biến áp trên núi đá',
      'Đổ kè chắn đất chống sạt lở mùa mưa bão sườn đồi'
    ],
    advantages: [
      'Phụ gia duy trì độ sụt ổn định suốt cung đường dài từ trạm trộn',
      'Đội ngũ thợ bơm tĩnh dạn dày kinh nghiệm kéo ống sườn đồi',
      'Cát vàng đá 1x2 tuyển chọn chất lượng cao không lẫn tạp chất',
      'Đo độ sụt nón côn và nén mẫu R28 nghiệm thu đầy đủ'
    ],
    sections: [
      {
        title: 'Giải Pháp Đổ Bê Tông Thương Phẩm Địa Hình Đồi Núi Nho Quan',
        content: 'Cự ly vận chuyển về Nho Quan dài hơn khu vực đồng bằng nên cấp phối bê tông được nghiên cứu tỉ mỉ với phụ gia siêu dẻo kéo dài thời gian ninh kết, giúp bê tông khi đến chân công trình vẫn giữ nguyên độ dẻo và cường độ thiết kế.',
        points: [
          'Điều phối xe bồn xuất trạm đúng giờ, chạy thẳng tuyến QL12B.',
          'Hỗ trợ bơm tĩnh vượt qua các ngõ nhỏ đường làng khúc khuỷu.',
          'Đảm bảo mác bê tông chuẩn 100%, bảo hành nén mẫu LAS-XD.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Nho Quan', href: '/bang-gia', description: 'Bảng giá bê tông tươi tại Nho Quan.', badge: 'Báo Giá' },
      { title: 'Dịch Vụ Bơm Bê Tông', href: '/bom-be-tong', description: 'Xe bơm cần và bơm kéo tĩnh.', badge: 'Xe Bơm' }
    ],
    faqs: [
      {
        question: 'Xe bồn chạy từ trạm về Nho Quan có bị khô se mặt bê tông không?',
        answer: 'Không. Chúng tôi sử dụng phụ gia duy trì độ dẻo công nghệ mới giúp bê tông giữ nguyên độ sụt thiết kế trong suốt 90 - 120 phút trên đường chạy.'
      }
    ]
  },

  // 17. BÊ TÔNG TƯƠI YÊN MÔ
  'be-tong-tuoi-yen-mo': {
    title: 'Bê Tông Tươi Yên Mô - Cung Cấp Mác Chuẩn TCVN & Đội Xe Bồn Phục Vụ 24/7',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Khu Vực Phía Nam',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80',
    description: 'Cung cấp bê tông tươi khắp Huyện Yên Mô: Thị trấn Yên Thịnh, Yên Hòa, Yên Từ, Yên Phong, Yên Từ, Mai Sơn, Yên Thái, Yên Lâm, Yên Mạc, Yên Đồng, CCN Mai Sơn. Tiếp giáp 2 cụm trạm Khánh Phú và Kim Sơn nên vận chuyển siêu nhanh.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M150, M200, M250, M300, M350' },
      { label: 'Cự ly xuất trạm', value: '10 - 18 km từ Trạm Kim Sơn hoặc Khánh Phú' },
      { label: 'Thời gian giao hàng', value: '20 - 30 phút có mặt tại công trình' },
      { label: 'Khu công nghiệp', value: 'Phục vụ Cụm công nghiệp Mai Sơn' },
      { label: 'Hotline điều độ', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng bè, dầm sàn nhà phố Thị trấn Yên Thịnh & các xã Yên Mô',
      'Đổ sàn nhà xưởng may, cơ khí tại CCN Mai Sơn',
      'Đổ móng kiên cố cho nhà ở vùng đất phù sa ven sông Yên Mô',
      'Đổ đường bê tông giao thông nông thôn mới'
    ],
    advantages: [
      'Nằm ở vị trí trung tâm giữa 2 trạm trộn Khánh Phú và Kim Sơn',
      'Giá thành cạnh tranh, điều độ xe bồn linh hoạt hai đầu',
      'Bơm cần vươn cao đổ sàn mái 3-5 tầng dễ dàng',
      'Kẹp chì niêm phong xe bồn minh bạch 100%'
    ],
    sections: [
      {
        title: 'Năng Lực Cung Ứng Bê Tông Thương Phẩm Tại Huyện Yên Mô',
        content: 'Yên Mô có lợi thế đặc biệt khi nằm kẹp giữa 2 cụm trạm trộn tự động của An Gia Bình. Tùy theo vị trí xã của khách hàng, trạm điều khiển sẽ xuất xe bồn từ trạm gần nhất để rút ngắn tối đa thời gian di chuyển và cước phí.',
        points: [
          'Xe bồn xuất phát từ Trạm Kim Sơn phục vụ các xã phía Nam: Yên Lâm, Yên Mạc, Yên Đồng.',
          'Xe bồn xuất phát từ Trạm Khánh Phú phục vụ các xã phía Bắc: Mai Sơn, Yên Hòa, Yên Từ, TT Yên Thịnh.',
          'Bơm cần 37m - 52m tiếp cận mọi ngõ xóm thuận tiện.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Yên Mô', href: '/bang-gia', description: 'Đơn giá mác 250, mác 300 Yên Mô.', badge: 'Báo Giá' },
      { title: 'Bê Tông Tươi Toàn Diện', href: '/be-tong-tuoi', description: 'Các sản phẩm bê tông thương phẩm.', badge: 'Sản Phẩm' }
    ],
    faqs: [
      {
        question: 'Tại Yên Mô tôi nên gọi trước bao lâu để có xe đổ móng?',
        answer: 'Quý khách nên liên hệ trước 1 ngày qua hotline 0988 2662 93 để kỹ sư khảo sát đường đi và giữ giờ vàng đổ sàn chuẩn xác nhất.'
      }
    ]
  },

  // 18. BÊ TÔNG TƯƠI HOA LƯ
  'be-tong-tuoi-hoa-lu': {
    title: 'Bê Tông Tươi Hoa Lư - Cung Cấp Chuẩn Mác & Giải Pháp Bảo Vệ Cảnh Quan Di Sản',
    categoryName: 'Địa Bàn Hoạt Động',
    badge: 'Cố Đô Di Sản',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    description: 'Cung cấp bê tông thương phẩm tại Huyện Hoa Lư: Thị trấn Thiên Tôn, Ninh Thắng, Ninh Hải, Ninh Xuân, Ninh Mỹ, Ninh Giang, Ninh Khang, Ninh Hòa, Ninh An, Ninh Vân. Phục vụ các dự án khách sạn, homestay, biệt thự vùng di sản Tràng An - Tam Cốc.',
    specifications: [
      { label: 'Cấp mác bê tông', value: 'M200, M250, M300, M350, M400' },
      { label: 'Cự ly xuất xưởng', value: 'Chỉ 8 - 15 km từ Trạm KCN Khánh Phú' },
      { label: 'Thời gian di chuyển', value: '15 - 20 phút chạy xe bồn' },
      { label: 'Khu du lịch', value: 'Tam Cốc - Bích Động, Tràng An, Làng đá Ninh Vân' },
      { label: 'Hotline 24/7', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng và sàn khu nghỉ dưỡng sinh thái, resort cao cấp Tam Cốc',
      'Đổ móng nhà phố, homestay phục vụ khách du lịch tại Ninh Thắng, Ninh Hải',
      'Đổ móng máy cắt xẻ đá nặng tại làng nghề đá mỹ nghệ Ninh Vân',
      'Bê tông móng bè trên nền đá vôi karst nứt nẻ Hoa Lư'
    ],
    advantages: [
      'Thi công sạch sẽ, che chắn vòi xả không làm bẩn môi trường du lịch di sản',
      'Xe bơm cần vươn xa không làm ảnh hưởng cây xanh cảnh quan',
      'Chất lượng mác ổn định, đúc mẫu thí nghiệm nén LAS-XD đầy đủ',
      'Điều độ xe bồn linh hoạt tránh giờ cao điểm đón khách du lịch'
    ],
    sections: [
      {
        title: 'Bê Tông Thương Phẩm Đẳng Cấp Cho Khu Du Lịch Hoa Lư',
        content: 'Hoa Lư là trung tâm du lịch di sản của tỉnh Ninh Bình với mật độ khách sạn, resort sinh thái dày đặc. Bê Tông An Gia Bình cam kết tiêu chuẩn thi công văn minh, chuyên nghiệp, tiếng ồn thấp và bảo vệ tối đa cảnh quan môi trường.',
        points: [
          'Đổ sàn bê tông mài bóng trang trí mỹ thuật cho resort, nhà hàng.',
          'Bơm tĩnh áp lực cao luồn sâu vào các thung lũng đá vôi không có đường xe bồn.',
          'Mác bê tông 300, 350 chịu lực uốn nén cao cho sàn vượt nhịp lớn.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Hoa Lư', href: '/bang-gia', description: 'Đơn giá bê tông tươi giao tại Hoa Lư.', badge: 'Báo Giá' },
      { title: 'Dự Án Đã Đổ Tại Hoa Lư', href: '/du-an', description: 'Các resort, biệt thự tiêu biểu Hoa Lư.', badge: 'Dự Án' }
    ],
    faqs: [
      {
        question: 'Khu vực Tam Cốc đường hẹp xe bồn có vào được khu nghỉ dưỡng không?',
        answer: 'Chúng tôi khảo sát thực tế và dùng xe bơm cần vươn qua hàng rào hoặc xe bơm tĩnh nối ống thép luồn vào tận khuôn viên resort mà không làm hỏng cảnh quan.'
      }
    ]
  },

  // 19. BÊ TÔNG KCN KHÁNH PHÚ
  'be-tong-kcn-khanh-phu': {
    title: 'Cung Cấp Bê Tông Tươi KCN Khánh Phú - Trạm Trộn Trực Tiếp 300m³/h Cung Ứng Siêu Tốc',
    categoryName: 'Dự Án Công Nghiệp',
    badge: 'Trụ Sở Nhà Máy',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80',
    description: 'Trụ sở cụm trạm trộn tự động An Gia Bình đặt ngay tại KCN Khánh Phú, Phường Đông Hoa Lư, Tỉnh Ninh Bình. Cung cấp bê tông tươi cho các nhà máy FDI, nhà xưởng công nghiệp nặng, sàn epoxy tải xe container, móng máy rung, cọc khoan nhồi.',
    specifications: [
      { label: 'Vị trí trạm trộn', value: 'KCN Khánh Phú, Tỉnh Ninh Bình' },
      { label: 'Công suất trạm', value: '300 m³/h (2 nồi trộn độc lập)' },
      { label: 'Thời gian xuất xưởng', value: 'Chỉ 5 - 10 phút đến mọi nhà máy trong KCN' },
      { label: 'Mác đặc chủng', value: 'M300, M350, M400, M500, Bê tông đông kết sớm R7' },
      { label: 'Dàn xe phục vụ', value: '25 xe bồn túc trực tại cổng trạm' },
      { label: 'Hotline dự án', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng khối lớn liên tục 500m³ - 2500m³ cho nhà xưởng KCN Khánh Phú',
      'Đổ sàn nhà xưởng chịu tải xe nâng 10 tấn và xe container',
      'Đổ móng máy rung công nghiệp, móng lò tôi, móng cẩu trục',
      'Đổ đường nội bộ KCN, bãi container và hệ thống xử lý nước thải'
    ],
    advantages: [
      'Trạm nằm ngay trong KCN nên thời gian giao hàng gần như tức thì',
      'Đáp ứng đổ liên tục 24/24 giờ xuyên đêm không ngắt mạch',
      'Đầy đủ hồ sơ năng lực, chứng chỉ hợp chuẩn hợp quy và CO/CQ',
      'Hóa đơn VAT và thủ tục pháp lý nghiệm thu minh bạch'
    ],
    sections: [
      {
        title: 'Năng Lực Cung Ứng Dự Án Trọng Điểm Tại KCN Khánh Phú',
        content: 'Là đối tác tin cậy của hàng chục nhà máy FDI và tổng thầu xây dựng tại KCN Khánh Phú, Bê Tông An Gia Bình tự hào cung cấp hàng triệu mét khối bê tông thương phẩm đạt chuẩn chất lượng quốc tế.',
        points: [
          'Hệ thống cân điện tử tự động hóa Siemens kiểm soát sai số dưới 0.5%.',
          'Đội ngũ kỹ sư LAS-XD túc trực kiểm định mẫu nén R7, R28 tại hiện trường.',
          'Dàn xe bơm cần 52m, 56m công suất 180m³/h bơm liên tục ngày đêm.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Dự Án KCN', href: '/bang-gia', description: 'Đơn giá chiết khấu cho khối lượng lớn.', badge: 'Báo Giá' },
      { title: 'Hồ Sơ Năng Lực Trạm Trộn', href: '/ho-so-nang-luc', description: 'Chứng chỉ thiết bị và năng lực cung ứng.', badge: 'Hồ Sơ' },
      { title: 'Quy Trình Kiểm Định LAS', href: '/quy-trinh-san-xuat', description: 'Quy chuẩn sản xuất TCVN.', badge: 'Kiểm Định' }
    ],
    faqs: [
      {
        question: 'Dự án trong KCN Khánh Phú có thể đổ bê tông ca đêm 1000m³ được không?',
        answer: 'Hoàn toàn đáp ứng được. Trạm Khánh Phú của chúng tôi vận hành 2 nồi trộn độc lập 300m³/h cùng hơn 25 xe bồn chuyên dụng, sẵn sàng đổ liên tục 1000m³ - 2500m³ thâu đêm an toàn.'
      }
    ]
  },

  // 20. BÊ TÔNG KCN GIÁN KHẨU
  'be-tong-kcn-gian-khau': {
    title: 'Cung Cấp Bê Tông Tươi KCN Gián Khẩu - Phục Vụ Nhà Xưởng Tải Trọng Nặng',
    categoryName: 'Dự Án Công Nghiệp',
    badge: 'Khu Công Nghiệp Lớn',
    heroImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    description: 'Cung cấp bê tông thương phẩm chuyên nghiệp cho các nhà máy sản xuất linh kiện điện tử, cơ khí chính xác tại KCN Gián Khẩu (Gia Viễn, Ninh Bình). Đảm bảo mác kỹ thuật M250 - M450, phụ gia tăng cứng, chống mài mòn cho sàn công nghiệp.',
    specifications: [
      { label: 'Cấp mác cung cấp', value: 'M250, M300, M350, M400, M450' },
      { label: 'Cự ly vận chuyển', value: '12 - 15 km qua tuyến QL1A thông thoáng' },
      { label: 'Thời gian di chuyển', value: '20 - 25 phút xe bồn' },
      { label: 'Đặc thù công trình', value: 'Sàn không nứt, móng cẩu trục, hào kỹ thuật' },
      { label: 'Hotline dự án', value: '0988 2662 93' }
    ],
    applications: [
      'Đổ móng và sàn nhà xưởng sản xuất kính, dệt may, cơ khí KCN Gián Khẩu',
      'Đổ sàn bê tông mác 350 đánh bóng tăng cứng bằng sika chapdur',
      'Đổ móng máy ép nặng chống rung chấn lan truyền',
      'Đổ hệ thống cống hộp, bãi đỗ xe tải và trạm cân xe KCN'
    ],
    advantages: [
      'Xe bồn chạy tuyến QL1A đường rộng, bê tông duy trì độ tươi lý tưởng',
      'Cung ứng liên tục các ca đổ sàn nhịp lớn 500m³ - 1500m³',
      'Hồ sơ nghiệm thu, chứng nhận chất lượng đầy đủ theo yêu cầu nhà thầu FDI',
      'Đội ngũ điều độ túc trực 24/7 theo tiến độ công trường'
    ],
    sections: [
      {
        title: 'Giải Pháp Bê Tông Sàn Công Nghiệp Tại KCN Gián Khẩu',
        content: 'Các nhà xưởng tại KCN Gián Khẩu có yêu cầu rất cao về độ phẳng mặt sàn, khả năng chịu tải trọng và chống mài mòn. Cấp phối bê tông của An Gia Bình sử dụng cát hạt lớn và phụ gia giảm co ngót, giúp sàn sau khi xoa nền đạt độ bóng láng và độ cứng vượt trội.',
        points: [
          'Độ sụt khống chế chuẩn 14±2cm cho bơm cần công suất lớn.',
          'Tích hợp sợi gia cường chống nứt vi mô cho sàn nhịp lớn.',
          'Bảo hành chất lượng mẫu nén R28 tại phòng kiểm định LAS-XD.'
        ]
      }
    ],
    internalLinks: [
      { title: 'Báo Giá Bê Tông Dự Án', href: '/bang-gia', description: 'Đơn giá chiết khấu cho KCN Gián Khẩu.', badge: 'Báo Giá' },
      { title: 'Hồ Sơ Năng Lực Trạm Trộn', href: '/ho-so-nang-luc', description: 'Năng lực trạm đôi 450m³/h.', badge: 'Hồ Sơ' }
    ],
    faqs: [
      {
        question: 'Bê tông đổ sàn nhà xưởng KCN Gián Khẩu có xuất hóa đơn GTGT và chứng chỉ xuất xưởng không?',
        answer: 'Có đầy đủ 100%. Mọi mẻ bê tông của An Gia Bình đều có phiếu xuất xưởng điện tử, tem kẹp chì, chứng chỉ kiểm định chất lượng và xuất hóa đơn VAT theo đúng hợp đồng.'
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
