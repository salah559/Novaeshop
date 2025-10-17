
export default function Admin(){
  return (
    <div>
      <h2>لوحة الأدمن (تجريبية)</h2>
      <div className="card">
        <p>هنا ستعرض الطلبات وتؤكد الدفع.</p>
        <p>ملاحظة: عمليات التأكيد يجب أن تتم عبر API تستخدم SERVICE_ROLE_KEY.</p>
      </div>
    </div>
  );
}
