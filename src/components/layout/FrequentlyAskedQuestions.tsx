import Image from 'next/image'

const questions = [
  ['Làm thế nào để chọn gói Internet Viettel phù hợp?', 'Bạn nên chọn theo số người, số thiết bị và nhu cầu sử dụng. Nhà nhiều phòng hoặc nhiều tầng có thể chọn thêm Mesh WiFi. Bấm đăng ký tư vấn để được kiểm tra hạ tầng và chọn gói theo địa chỉ của bạn.'],
  ['Gia đình nên dùng băng thông bao nhiêu Mbps là đủ?', 'Gói từ 300 Mbps có thể đáp ứng nhiều nhu cầu học tập, làm việc và giải trí thông thường. Nếu có nhiều thiết bị sử dụng cùng lúc, tải tệp lớn hoặc xem video chất lượng cao, bạn có thể cân nhắc gói tốc độ cao hơn.'],
  ['WiFi 6 của Viettel có khác WiFi thường không?', 'WiFi 6 là thế hệ kết nối không dây mới hơn WiFi 5, hỗ trợ sử dụng nhiều thiết bị hiệu quả hơn. Trải nghiệm thực tế còn phụ thuộc thiết bị đầu cuối, khoảng cách tới modem và vật cản trong nhà.'],
  ['Nhà nhiều tầng có cần Mesh WiFi không?', 'Mesh WiFi giúp mở rộng vùng phủ bằng nhiều điểm phát liên kết với nhau. Nếu các tầng hoặc phòng xa modem có sóng yếu, bạn nên tham khảo gói Mesh và vị trí đặt thiết bị phù hợp.'],
  ['Có thể nâng cấp hoặc hạ cấp gói Internet trong quá trình sử dụng không?', 'Bạn có thể liên hệ để được kiểm tra điều kiện đổi gói. Gói có thể chuyển, chi phí và thời hạn cam kết sẽ được xác nhận theo hợp đồng đang sử dụng.'],
  ['Đổi gói Internet có bị gián đoạn mạng không?', 'Việc đổi gói có thể cần điều chỉnh cấu hình hoặc thiết bị. Nhân viên sẽ thông báo cách thực hiện và thời gian dự kiến sau khi kiểm tra đường truyền của bạn.'],
  ['Thời gian lắp mạng Internet Viettel mất bao lâu?', 'Sau khi nhận đăng ký, nhân viên sẽ kiểm tra hạ tầng và liên hệ hẹn lịch. Thời gian lắp đặt cụ thể phụ thuộc khu vực, điều kiện tại nhà và lịch bạn lựa chọn.'],
  ['Internet Viettel có phù hợp cho chơi game và làm việc online không?', 'Bạn có thể chọn gói theo nhu cầu chơi game, họp trực tuyến và làm việc từ xa. Với thiết bị cố định, kết nối bằng dây mạng thường ổn định hơn; chất lượng còn phụ thuộc máy chủ, thiết bị và môi trường mạng.'],
]

export function FrequentlyAskedQuestions() {
  return <section className="faq-section" aria-labelledby="faq-title"><div className="container faq-layout">
    <div><h2 id="faq-title">Câu hỏi thường gặp</h2><div className="faq-list">
      {questions.map(([question, answer]) => <details key={question}>
        <summary>{question}<span className="faq-chevron" aria-hidden="true" /></summary><p>{answer}</p>
      </details>)}
    </div></div>
    <div className="faq-illustration"><Image src="/images/internet-faq.png" alt="" width={520} height={520} sizes="(max-width: 760px) 220px, 420px" /></div>
  </div></section>
}
