import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../lib/api';
import './DoctorExamPages.css';

const DoctorMedicalRecord = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [drugOptions, setDrugOptions] = useState([]);
    const [diagnosis, setDiagnosis] = useState('');
    const [note, setNote] = useState('');
    const [prescriptionItems, setPrescriptionItems] = useState([
        { drug_id: '', dosage: '', quantity: '', duration: '', instructions: '' }
    ]);
    const [testOrders, setTestOrders] = useState([]);
    const [labDecisionNotes, setLabDecisionNotes] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const [apptRes, drugsRes, testsRes] = await Promise.all([
                api.get(`/api/appointments/doctor-appointment/${appointmentId}`),
                api.get('/api/medicines/drugs'),
                api.get(`/api/health/test-orders/by-appointment/${appointmentId}`).catch(() => ({ data: { orders: [] } }))
            ]);
            setAppointment(apptRes.data.appointment);
            setDrugOptions(drugsRes.data.drugs || []);
            setTestOrders(testsRes.data.orders || []);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Không tải được lịch khám');
            navigate('/examine');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [appointmentId]);

    const buildPrescriptionText = (items) => {
        return items
            .filter((it) => it.drug_id && it.dosage && it.quantity)
            .map((it) => {
                const drug = drugOptions.find((d) => String(d.id) === String(it.drug_id));
                const drugName = drug?.name || `Drug#${it.drug_id}`;
                return `${drugName} - ${it.dosage} - SL ${it.quantity}${it.duration ? ` - ${it.duration}` : ''}`;
            })
            .join('\n');
    };

    const handleExamine = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/medical-records', {
                appointment_id: Number(appointmentId),
                diagnosis,
                prescription: buildPrescriptionText(prescriptionItems),
                note,
                prescription_items: prescriptionItems
                    .filter((it) => it.drug_id && it.dosage && Number(it.quantity) > 0)
                    .map((it) => ({
                        drug_id: Number(it.drug_id),
                        dosage: it.dosage,
                        quantity: Number(it.quantity),
                        duration: it.duration || null,
                        instructions: it.instructions || null
                    }))
            });
            toast.success('Đã lưu hồ sơ bệnh án thành công!');
            navigate('/examine');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể lưu bệnh án');
        }
    };

    const submitLabDecision = async (decision) => {
        try {
            await api.post(`/api/lab/doctor-decision/${appointmentId}`, {
                decision,
                notes: labDecisionNotes || null
            });
            toast.success(decision === 'admission' ? 'Đã ghi nhận chỉ định nhập viện.' : 'Đã xác nhận kết quả xét nghiệm.');
            load();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi');
        }
    };

    const addRx = () =>
        setPrescriptionItems((prev) => [...prev, { drug_id: '', dosage: '', quantity: '', duration: '', instructions: '' }]);
    const removeRx = (index) =>
        setPrescriptionItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    const updateRx = (index, field, value) =>
        setPrescriptionItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

    if (loading || !appointment) {
        return (
            <div className="doc-exam-loading">
                <div className="spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    const awaitingLab = appointment.lab_workflow_status === 'awaiting_doctor_lab';
    const labPaymentPending = appointment.lab_workflow_status === 'awaiting_lab_payment';

    return (
        <div className="doc-medical-record">
            <div className="doc-exam-hero">
                <button type="button" className="btn-back" onClick={() => navigate('/examine')}>
                    ← Quay lại hàng đợi
                </button>
                <div>
                    <h1>Viết bệnh án</h1>
                    <p className="doc-exam-sub">
                        <strong>{appointment.patient_name}</strong> · {appointment.appointment_time?.slice(0, 5)} ·{' '}
                        {appointment.status}
                    </p>
                </div>
            </div>

            <div className="doc-exam-actions">
                <Link className="doc-action-card doc-action-vitals" to={`/doctor/examine/${appointmentId}/vitals`}>
                    <span className="doc-action-icon">📊</span>
                    <div>
                        <strong>Khám sức khỏe</strong>
                        <small>Chỉ số sinh tồn & đánh giá sơ bộ</small>
                    </div>
                </Link>
                <Link className="doc-action-card doc-action-lab" to={`/doctor/examine/${appointmentId}/lab`}>
                    <span className="doc-action-icon">🧪</span>
                    <div>
                        <strong>Chỉ định xét nghiệm</strong>
                        <small>Chọn danh mục → chọn xét nghiệm</small>
                    </div>
                </Link>
            </div>

            {labPaymentPending && (
                <div className="doc-banner doc-banner-warn">
                    Có chỉ định xét nghiệm <strong>chưa thanh toán</strong> tại quầy lễ tân. BN làm xét nghiệm sau khi đóng phí.
                </div>
            )}

            {awaitingLab && (
                <section className="doc-lab-review">
                    <h2>Kết quả xét nghiệm — cần xác nhận</h2>
                    <ul className="doc-lab-list">
                        {testOrders.map((o) => (
                            <li key={o.id}>
                                <strong>{o.test_name}</strong> ({o.code}) —{' '}
                                <span className={`st st-${o.status}`}>{o.status}</span>
                                {o.test_result && (
                                    <pre className="lab-result-pre">{o.test_result}</pre>
                                )}
                            </li>
                        ))}
                    </ul>
                    <textarea
                        className="doc-lab-notes"
                        rows={2}
                        placeholder="Ghi chú thêm (tuỳ chọn)..."
                        value={labDecisionNotes}
                        onChange={(e) => setLabDecisionNotes(e.target.value)}
                    />
                    <div className="doc-lab-btns">
                        <button type="button" className="btn-ok" onClick={() => submitLabDecision('approve_discharge')}>
                            Đồng ý — tiếp tục kê đơn / xuất viện
                        </button>
                        <button type="button" className="btn-admit" onClick={() => submitLabDecision('admission')}>
                            Chỉ định nhập viện
                        </button>
                    </div>
                </section>
            )}

            {(Number(appointment.admission_requested) === 1 || appointment.admission_requested === true) && (
                <div className="doc-banner doc-banner-danger">Đã ghi nhận chỉ định nhập viện cho ca này.</div>
            )}

            <form className="doc-medical-form" onSubmit={handleExamine}>
                <div className="form-block">
                    <label>Chẩn đoán</label>
                    <input
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        required
                        placeholder="VD: Viêm họng cấp"
                    />
                </div>

                <div className="form-block">
                    <label>Đơn thuốc</label>
                    {prescriptionItems.map((item, index) => (
                        <div className="rx-row" key={index}>
                            <select
                                value={item.drug_id}
                                onChange={(e) => updateRx(index, 'drug_id', e.target.value)}
                                required
                            >
                                <option value="">— Thuốc —</option>
                                {drugOptions.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                placeholder="Liều"
                                value={item.dosage}
                                onChange={(e) => updateRx(index, 'dosage', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                min={1}
                                placeholder="SL"
                                value={item.quantity}
                                onChange={(e) => updateRx(index, 'quantity', e.target.value)}
                                required
                            />
                            <input
                                placeholder="Ngày"
                                value={item.duration}
                                onChange={(e) => updateRx(index, 'duration', e.target.value)}
                            />
                            <input
                                placeholder="Lời dặn thuốc"
                                value={item.instructions}
                                onChange={(e) => updateRx(index, 'instructions', e.target.value)}
                            />
                            <button type="button" className="btn-rm" onClick={() => removeRx(index)}>
                                ×
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn-add-rx" onClick={addRx}>
                        + Thêm thuốc
                    </button>
                </div>

                <div className="form-block">
                    <label>Lời dặn chung</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Uống nhiều nước..." />
                </div>

                <div className="form-footer-btns">
                    <button type="submit" className="btn-save-main">
                        Lưu bệnh án & hoàn thành khám
                    </button>
                </div>
            </form>
        </div>
    );
};

// ===========================================================
// New Rx form (design/UX spec update)
// ===========================================================
const formatAfterMealLabel = (minutes) => {
    const m = Number(minutes);
    if (m === 15) return '15 phút';
    if (m === 30) return '30 phút';
    if (m === 60) return '1 giờ';
    if (m === 120) return '2 giờ';
    return `${m} phút`;
};

const generateRxInstructions = ({ dosage, timesPerDay, whenMeal, afterMealMinutes, days }) => {
    const d = Number(dosage ?? 1);
    const t = Number(timesPerDay ?? 1);
    const y = Number(days ?? 3);

    let mealText = '';
    if (whenMeal === 'before_meal') mealText = 'trước ăn';
    else if (whenMeal === 'in_meal') mealText = 'trong ăn';
    else mealText = `sau ăn ${formatAfterMealLabel(afterMealMinutes)}`;

    return `Uống ${d} viên/lần, ngày ${t} lần, ${mealText}, trong ${y} ngày.`;
};

const parseNumberFromText = (s) => {
    const m = String(s || '').match(/(\d+)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
};

const parseWhenMealFromInstructions = (instructions) => {
    const s = String(instructions || '').toLowerCase();
    if (s.includes('trước ăn')) return 'before_meal';
    if (s.includes('trong ăn')) return 'in_meal';
    if (s.includes('sau ăn')) return 'after_meal';
    return 'in_meal';
};

const parseAfterMealMinutes = (instructions) => {
    const s = String(instructions || '').toLowerCase();
    if (s.includes('15 phút')) return 15;
    if (s.includes('30 phút')) return 30;
    if (s.includes('1 giờ')) return 60;
    if (s.includes('2 giờ')) return 120;
    // Fallback by finding "(\d+) phút" pattern
    const m = s.match(/(\d+)\s*phút/);
    if (m) {
        const val = Number(m[1]);
        if ([15, 30].includes(val)) return val;
    }
    return 30;
};

const DrugCombobox = ({ disabled, valueDrugId, valueDrugName, onSelect, recentOptions }) => {
    const containerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState(valueDrugName || '');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const normalizedValueName = valueDrugName || '';

    useEffect(() => {
        // Keep input display synced with selected drug
        setKeyword(normalizedValueName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDrugId]);

    const fetchOptions = async (kw) => {
        setLoading(true);
        try {
            const params = { limit: kw ? 15 : 10 };
            if (kw) params.search = kw;

            const res = await api.get('/api/medicines/drugs', { params });
            const fetched = res.data?.drugs || [];
            const merged = [];
            const seen = new Set();

            // Recent first
            const recents = Array.isArray(recentOptions) ? recentOptions : [];
            for (const r of recents) {
                if (!r?.id) continue;
                if (seen.has(String(r.id))) continue;
                seen.add(String(r.id));
                merged.push(r);
            }

            for (const d of fetched) {
                if (!d?.id) continue;
                if (seen.has(String(d.id))) continue;
                seen.add(String(d.id));
                merged.push(d);
            }

            setOptions(merged);
            setActiveIndex(merged.length > 0 ? 0 : -1);
        } catch {
            setOptions([]);
            setActiveIndex(-1);
        } finally {
            setLoading(false);
        }
    };

    const close = () => setOpen(false);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            if (!containerRef.current) return;
            if (containerRef.current.contains(e.target)) return;
            close();
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    const onFocus = () => {
        if (disabled) return;
        setOpen(true);
        // Luôn hiển thị danh sách mặc định (top thuốc / gần đây)
        fetchOptions('');
    };

    const onChange = (e) => {
        const next = e.target.value;
        setKeyword(next);

        if (disabled) return;

        // If user clears input -> show default list and clear selection
        if (!next.trim()) {
            onSelect?.(null);
            setOpen(true);
            fetchOptions('');
            return;
        }

        setOpen(true);
        fetchOptions(next.trim());
    };

    const selectOption = (opt) => {
        if (disabled) return;
        if (!opt) return;
        onSelect?.({ id: opt.id, name: opt.name || opt.drug_name || '' });
        setKeyword(opt.name || '');
        setOpen(false);
    };

    const onKeyDown = (e) => {
        if (disabled) return;
        if (!open) {
            if (e.key === 'ArrowDown') {
                setOpen(true);
                if (!options.length) fetchOptions('');
            }
            return;
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            return;
        }
        if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < options.length) {
                e.preventDefault();
                selectOption(options[activeIndex]);
            }
            return;
        }
    };

    return (
        <div className="drug-combo" ref={containerRef}>
            <input
                type="text"
                disabled={disabled}
                className="drug-combo-input"
                placeholder={disabled ? '' : 'Tìm thuốc...'}
                value={keyword}
                onFocus={onFocus}
                onChange={onChange}
                onKeyDown={onKeyDown}
                autoComplete="off"
            />
            {open && (
                <div className="drug-combo-dropdown">
                    {loading ? (
                        <div className="drug-combo-item drug-combo-loading">Đang tìm...</div>
                    ) : options.length === 0 ? (
                        <div className="drug-combo-item drug-combo-empty">Không tìm thấy</div>
                    ) : (
                        options.map((opt, idx) => (
                            <div
                                key={opt.id}
                                className={`drug-combo-item ${idx === activeIndex ? 'active' : ''}`}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onMouseDown={(e) => {
                                    // Prevent blur before click selects
                                    e.preventDefault();
                                    selectOption(opt);
                                }}
                            >
                                {opt.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const DoctorMedicalRecordNew = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [testOrders, setTestOrders] = useState([]);

    const [diagnosis, setDiagnosis] = useState('');
    const [note, setNote] = useState('');

    const [labDecisionNotes, setLabDecisionNotes] = useState('');

    const initialRxLine = {
        drug_id: '',
        drug_name: '',
        dosage: 1,
        timesPerDay: 1,
        days: 3,
        whenMeal: 'after_meal',
        afterMealMinutes: 30,
        instructions: generateRxInstructions({
            dosage: 1,
            timesPerDay: 1,
            whenMeal: 'after_meal',
            afterMealMinutes: 30,
            days: 3
        }),
        instructionsEdited: false
    };

    const [rxLines, setRxLines] = useState([initialRxLine]);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const recentKey = user?.username ? `rx_recent_drugs_${user.username}` : 'rx_recent_drugs';
    const recentOptions = useMemo(() => {
        try {
            const raw = localStorage.getItem(recentKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((x) => x?.id && x?.name).slice(0, 6);
        } catch {
            return [];
        }
    }, [recentKey, user?.username]);

    const canEditRx = appointment?.status === 'checked-in';
    const awaitingLab = appointment?.lab_workflow_status === 'awaiting_doctor_lab';
    const labPaymentPending = appointment?.lab_workflow_status === 'awaiting_lab_payment';

    const addToRecent = (drug) => {
        if (!drug?.id) return;
        try {
            const raw = localStorage.getItem(recentKey);
            const list = raw ? JSON.parse(raw) : [];
            const safe = Array.isArray(list) ? list : [];
            const next = [ { id: drug.id, name: drug.name }, ...safe.filter((x) => String(x.id) !== String(drug.id)) ];
            localStorage.setItem(recentKey, JSON.stringify(next.slice(0, 6)));
        } catch {
            // ignore
        }
    };

    const load = async () => {
        try {
            setLoading(true);
            const [apptRes, testsRes, presRes] = await Promise.all([
                api.get(`/api/appointments/doctor-appointment/${appointmentId}`),
                api.get(`/api/health/test-orders/by-appointment/${appointmentId}`).catch(() => ({ data: { orders: [] } })),
                api.get(`/api/medicines/prescriptions/by-appointment/${appointmentId}`).catch(() => ({ data: { prescription: null, items: [] } }))
            ]);

            setAppointment(apptRes.data.appointment || null);
            setTestOrders(testsRes.data.orders || testsRes.data?.items || []);

            const pres = presRes.data?.prescription;
            const items = presRes.data?.items || [];
            if (pres) {
                setDiagnosis(pres.diagnosis || '');
                setNote(pres.notes || '');
            }

            if (Array.isArray(items) && items.length > 0) {
                const nextLines = items.map((it) => {
                    const dosageNum = parseNumberFromText(it.dosage) ?? 1;
                    const daysFromDuration = parseNumberFromText(it.duration);
                    const daysFromInstructions = parseNumberFromText(
                        String((it.instructions || '').match(/trong\s+(\d+)\s+ngày/i)?.[1])
                    );
                    const daysNum = daysFromDuration ?? daysFromInstructions ?? 3;

                    const timesFromInstructions = parseNumberFromText(
                        String((it.instructions || '').match(/ngày\s+(\d+)\s+lần/i)?.[1])
                    );
                    const timesNum = timesFromInstructions ?? 1;

                    const whenMeal = parseWhenMealFromInstructions(it.instructions);
                    const afterMealMinutes = whenMeal === 'after_meal' ? parseAfterMealMinutes(it.instructions) : 30;
                    const instructions = it.instructions || generateRxInstructions({
                        dosage: dosageNum,
                        timesPerDay: timesNum,
                        whenMeal,
                        afterMealMinutes,
                        days: daysNum
                    });

                    // Mark as "not edited" so if user changes other fields, we can regenerate.
                    return {
                        drug_id: String(it.drug_id ?? ''),
                        drug_name: it.drug_name || '',
                        dosage: dosageNum,
                        timesPerDay: timesNum,
                        days: daysNum,
                        whenMeal,
                        afterMealMinutes,
                        instructions,
                        instructionsEdited: false
                    };
                });

                setRxLines(nextLines.length ? nextLines : [initialRxLine]);
            } else {
                setRxLines([initialRxLine]);
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Không tải được lịch khám');
            navigate('/examine');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const buildPrescriptionPayload = () => {
        const lines = rxLines
            .map((l) => {
                const sl = Number(l.dosage || 0) * Number(l.timesPerDay || 0) * Number(l.days || 0);
                if (!l.drug_id || !Number.isFinite(sl) || sl <= 0) return null;

                const dosageText = `${Number(l.dosage)} viên/lần`;
                const durationText = `${Number(l.days)} ngày`;
                const instructionsText = l.instructions || generateRxInstructions({
                    dosage: Number(l.dosage),
                    timesPerDay: Number(l.timesPerDay),
                    whenMeal: l.whenMeal,
                    afterMealMinutes: l.afterMealMinutes,
                    days: Number(l.days)
                });

                return {
                    drug_id: Number(l.drug_id),
                    dosage: dosageText,
                    quantity: sl,
                    duration: durationText,
                    instructions: instructionsText
                };
            })
            .filter(Boolean);

        const prescriptionText = rxLines
            .map((l) => {
                const sl = Number(l.dosage || 0) * Number(l.timesPerDay || 0) * Number(l.days || 0);
                if (!l.drug_id || !Number.isFinite(sl) || sl <= 0) return null;
                const drugName = l.drug_name || `Drug#${l.drug_id}`;
                return `${drugName} - ${Number(l.dosage)} viên/lần - SL ${sl} - ${Number(l.days)} ngày`;
            })
            .filter(Boolean)
            .join('\n');

        return { items: lines, prescriptionText };
    };

    const handleExamine = async (e) => {
        e.preventDefault();
        if (!canEditRx) {
            toast.warning('Ca khám đã hoàn thành, không thể chỉnh sửa đơn thuốc.');
            return;
        }

        try {
            const { items, prescriptionText } = buildPrescriptionPayload();
            if (!diagnosis.trim()) {
                toast.error('Vui lòng nhập chẩn đoán.');
                return;
            }
            if (!items.length) {
                toast.error('Vui lòng thêm ít nhất 1 thuốc hợp lệ.');
                return;
            }

            await api.post('/api/medical-records', {
                appointment_id: Number(appointmentId),
                diagnosis,
                prescription: prescriptionText,
                note: note || null,
                prescription_items: items
            });
            toast.success('Đã lưu hồ sơ bệnh án thành công!');
            navigate('/examine');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể lưu bệnh án');
        }
    };

    const submitLabDecision = async (decision) => {
        try {
            await api.post(`/api/lab/doctor-decision/${appointmentId}`, {
                decision,
                notes: labDecisionNotes || null
            });
            toast.success(decision === 'admission' ? 'Đã ghi nhận chỉ định nhập viện.' : 'Đã xác nhận kết quả xét nghiệm.');
            load();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi');
        }
    };

    const addRx = () => {
        setRxLines((prev) => [
            ...prev,
            {
                ...initialRxLine,
                instructions: generateRxInstructions({
                    dosage: 1,
                    timesPerDay: 1,
                    whenMeal: 'after_meal',
                    afterMealMinutes: 30,
                    days: 3
                })
            }
        ]);
    };

    const removeRx = (index) => {
        setRxLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    };

    const updateRxLine = (index, patch, { regenInstructions = true } = {}) => {
        setRxLines((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                const next = { ...item, ...patch };

                if (regenInstructions && !next.instructionsEdited) {
                    next.instructions = generateRxInstructions({
                        dosage: Number(next.dosage || 1),
                        timesPerDay: Number(next.timesPerDay || 1),
                        whenMeal: next.whenMeal,
                        afterMealMinutes: next.afterMealMinutes,
                        days: Number(next.days || 3)
                    });
                }
                return next;
            })
        );
    };

    if (loading || !appointment) {
        return (
            <div className="doc-exam-loading">
                <div className="spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="doc-medical-record">
            <div className="doc-exam-hero">
                <button type="button" className="btn-back" onClick={() => navigate('/examine')}>
                    ← Quay lại hàng đợi
                </button>
                <div>
                    <h1>Viết bệnh án</h1>
                    <p className="doc-exam-sub">
                        <strong>{appointment.patient_name}</strong> · {appointment.appointment_time?.slice(0, 5)} · {appointment.status}
                    </p>
                </div>
            </div>

            <div className="doc-exam-actions">
                <Link className="doc-action-card doc-action-vitals" to={`/doctor/examine/${appointmentId}/vitals`}>
                    <span className="doc-action-icon">📊</span>
                    <div>
                        <strong>Khám sức khỏe</strong>
                        <small>Chỉ số sinh tồn & đánh giá sơ bộ</small>
                    </div>
                </Link>
                <Link className="doc-action-card doc-action-lab" to={`/doctor/examine/${appointmentId}/lab`}>
                    <span className="doc-action-icon">🧪</span>
                    <div>
                        <strong>Chỉ định xét nghiệm</strong>
                        <small>Chọn danh mục → chọn xét nghiệm</small>
                    </div>
                </Link>
            </div>

            {labPaymentPending && (
                <div className="doc-banner doc-banner-warn">
                    Có chỉ định xét nghiệm <strong>chưa thanh toán</strong> tại quầy lễ tân. BN làm xét nghiệm sau khi đóng phí.
                </div>
            )}

            {canEditRx ? null : (
                <div className="doc-banner doc-banner-danger">
                    Ca khám đã hoàn thành. Đơn thuốc hiện đã khóa để tránh sai sót.
                </div>
            )}

            {awaitingLab && (
                <section className="doc-lab-review">
                    <h2>Kết quả xét nghiệm — cần xác nhận</h2>
                    <ul className="doc-lab-list">
                        {testOrders.map((o) => (
                            <li key={o.id}>
                                <strong>{o.test_name}</strong> ({o.code}) —{' '}
                                <span className={`st st-${o.status}`}>{o.status}</span>
                                {o.test_result && <pre className="lab-result-pre">{o.test_result}</pre>}
                            </li>
                        ))}
                    </ul>
                    <textarea
                        className="doc-lab-notes"
                        rows={2}
                        placeholder="Ghi chú thêm (tuỳ chọn)..."
                        value={labDecisionNotes}
                        onChange={(e) => setLabDecisionNotes(e.target.value)}
                        disabled={false}
                    />
                    <div className="doc-lab-btns">
                        <button type="button" className="btn-ok" onClick={() => submitLabDecision('approve_discharge')}>
                            Đồng ý — tiếp tục kê đơn / xuất viện
                        </button>
                        <button type="button" className="btn-admit" onClick={() => submitLabDecision('admission')}>
                            Chỉ định nhập viện
                        </button>
                    </div>
                </section>
            )}

            {(Number(appointment.admission_requested) === 1 || appointment.admission_requested === true) && (
                <div className="doc-banner doc-banner-danger">Đã ghi nhận chỉ định nhập viện cho ca này.</div>
            )}

            <form className="doc-medical-form" onSubmit={handleExamine}>
                <fieldset disabled={!canEditRx} style={{ border: 'none', padding: 0, margin: 0 }}>
                    <div className="form-block">
                        <label>Chẩn đoán</label>
                        <input
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            required
                            placeholder="VD: Viêm họng cấp"
                        />
                    </div>

                    <div className="form-block">
                        <label>Đơn thuốc</label>
                        {rxLines.map((line, index) => {
                            const sl = Number(line.dosage || 0) * Number(line.timesPerDay || 0) * Number(line.days || 0);
                            const showAfterMeal = line.whenMeal === 'after_meal';

                            return (
                                <div className="rx-line" key={index}>
                                    <div className="rx-grid">
                                        <div className="rx-field rx-drug">
                                            <DrugCombobox
                                                disabled={!canEditRx}
                                                valueDrugId={line.drug_id}
                                                valueDrugName={line.drug_name}
                                                recentOptions={recentOptions}
                                                onSelect={(opt) => {
                                                    if (!opt) {
                                                        updateRxLine(index, { drug_id: '', drug_name: '' }, { regenInstructions: false });
                                                        return;
                                                    }
                                                    updateRxLine(index, { drug_id: String(opt.id), drug_name: opt.name }, { regenInstructions: false });
                                                    addToRecent(opt);
                                                }}
                                            />
                                        </div>

                                        <div className="rx-field">
                                            <select
                                                value={line.dosage}
                                                onChange={(e) => updateRxLine(index, { dosage: Number(e.target.value) })}
                                            >
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1} viên
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="rx-field">
                                            <select
                                                value={line.timesPerDay}
                                                onChange={(e) => updateRxLine(index, { timesPerDay: Number(e.target.value) })}
                                            >
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} lần/ngày
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="rx-field">
                                            <select value={line.days} onChange={(e) => updateRxLine(index, { days: Number(e.target.value) })}>
                                                {[3, 5, 7, 10].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} ngày
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="rx-field">
                                            <select
                                                value={line.whenMeal}
                                                onChange={(e) => updateRxLine(index, { whenMeal: e.target.value })}
                                            >
                                                <option value="before_meal">Trước ăn</option>
                                                <option value="after_meal">Sau ăn</option>
                                                <option value="in_meal">Trong ăn</option>
                                            </select>
                                        </div>

                                        {showAfterMeal ? (
                                            <div className="rx-field">
                                                <select
                                                    value={line.afterMealMinutes}
                                                    onChange={(e) => updateRxLine(index, { afterMealMinutes: Number(e.target.value) })}
                                                >
                                                    {[15, 30, 60, 120].map((m) => (
                                                        <option key={m} value={m}>
                                                            Sau ăn {formatAfterMealLabel(m)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="rx-field rx-hidden-placeholder" aria-hidden="true" />
                                        )}

                                        <div className="rx-field">
                                            <input type="number" value={sl} disabled />
                                        </div>

                                        <button type="button" className="btn-rm" onClick={() => removeRx(index)}>
                                            ×
                                        </button>
                                    </div>

                                    <div className="rx-instructions">
                                        <label>Lời dặn thuốc</label>
                                        <textarea
                                            rows={2}
                                            value={line.instructions}
                                            onChange={(e) => {
                                                const txt = e.target.value;
                                                setRxLines((prev) =>
                                                    prev.map((it, i) =>
                                                        i === index
                                                            ? { ...it, instructions: txt, instructionsEdited: true }
                                                            : it
                                                    )
                                                );
                                            }}
                                            disabled={!canEditRx}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button type="button" className="btn-add-rx" onClick={addRx}>
                            + Thêm thuốc
                        </button>
                    </div>

                    <div className="form-block">
                        <label>Ghi chú bệnh án (tuỳ chọn)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder="VD: Theo dõi thêm 3 ngày..."
                        />
                    </div>

                    <div className="form-footer-btns">
                        <button type="submit" className="btn-save-main">
                            Lưu bệnh án & hoàn thành khám
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default DoctorMedicalRecordNew;
