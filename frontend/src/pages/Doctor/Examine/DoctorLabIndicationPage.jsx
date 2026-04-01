import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../lib/api';
import './DoctorExamPages.css';

const DoctorLabIndicationPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [tests, setTests] = useState([]);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingTests, setLoadingTests] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [notes, setNotes] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api
            .get('/api/health/lab-test-categories')
            .then((res) => setCategories(res.data.data || res.data.categories || []))
            .catch(() => toast.error('Không tải được danh mục'))
            .finally(() => setLoadingCat(false));
    }, []);

    const openCategory = async (cat) => {
        setSelectedCat(cat);
        setLoadingTests(true);
        setSelectedIds(new Set());
        try {
            const res = await api.get(`/api/health/lab-test-categories/${cat.id}`);
            setTests(res.data.tests || []);
        } catch {
            toast.error('Không tải được xét nghiệm');
            setTests([]);
        } finally {
            setLoadingTests(false);
        }
    };

    const toggle = (id) => {
        setSelectedIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const submitOrders = async () => {
        if (selectedIds.size === 0) {
            toast.warning('Chọn ít nhất một xét nghiệm');
            return;
        }
        setSaving(true);
        try {
            for (const testId of selectedIds) {
                await api.post('/api/health/test-orders', {
                    appointment_id: Number(appointmentId),
                    lab_test_id: testId,
                    quantity: 1,
                    notes: notes[testId] || null
                });
            }
            toast.success(`Đã tạo ${selectedIds.size} chỉ định. BN thanh toán tại lễ tân trước khi làm xét nghiệm.`);
            navigate(`/doctor/examine/${appointmentId}/write`);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi tạo chỉ định');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="doc-exam-page doc-lab-page">
            <button type="button" className="btn-back" onClick={() => navigate(`/doctor/examine/${appointmentId}/write`)}>
                ← Quay lại viết bệnh án
            </button>
            <h1>🧪 Chỉ định xét nghiệm</h1>
            <p className="doc-lab-hint">Bước 1: Chọn danh mục · Bước 2: Chọn xét nghiệm và xác nhận</p>

            {!selectedCat && (
                <div className="lab-cat-grid">
                    {loadingCat && <p>Đang tải danh mục...</p>}
                    {!loadingCat &&
                        categories.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className="lab-cat-card"
                                onClick={() => openCategory(c)}
                            >
                                <strong>{c.name}</strong>
                                {c.description && <small>{c.description}</small>}
                            </button>
                        ))}
                </div>
            )}

            {selectedCat && (
                <div className="lab-tests-panel">
                    <div className="lab-tests-head">
                        <button type="button" className="link-back" onClick={() => setSelectedCat(null)}>
                            ← Danh mục
                        </button>
                        <h2>{selectedCat.name}</h2>
                    </div>
                    {loadingTests && <p>Đang tải...</p>}
                    {!loadingTests && (
                        <ul className="lab-test-pick-list">
                            {tests.map((t) => (
                                <li key={t.id} className={selectedIds.has(t.id) ? 'picked' : ''}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(t.id)}
                                            onChange={() => toggle(t.id)}
                                        />
                                        <span>
                                            <strong>{t.name}</strong>
                                            <small>
                                                {t.code} · {Number(t.price).toLocaleString('vi-VN')}đ
                                            </small>
                                        </span>
                                    </label>
                                    {selectedIds.has(t.id) && (
                                        <input
                                            className="lab-note-inp"
                                            placeholder="Ghi chú"
                                            value={notes[t.id] || ''}
                                            onChange={(e) => setNotes((p) => ({ ...p, [t.id]: e.target.value }))}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button type="button" className="btn-save-main" disabled={saving} onClick={submitOrders}>
                        {saving ? 'Đang gửi...' : 'Xác nhận chỉ định'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DoctorLabIndicationPage;
