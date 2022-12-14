import React, { useState, useEffect, useMemo } from 'react';
import Router, { useRouter } from 'next/router';
import { Form, Input, Button, message } from 'antd';
import axios from '@blog/client/admin/axios';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import Drawer from './Drawer';
import Link from 'next/link';
import { isLogin } from '@blog/client/admin/api/is.login.api';
import { debounce } from 'lodash';
import isLength from 'validator/lib/isLength';
import dynamic from 'next/dynamic';
import style from './style.module.scss';

const ToastuiEditor = dynamic(() => import('@blog/client/admin/components/ToastuiEditor'), { ssr: false });

const { TextArea } = Input;

export default function Index() {
    const [editor, setEditor] = useState<any>(null);
    const [data, setData] = useState<any>({
        content: '',
    });
    const router = useRouter();
    const [form] = Form.useForm();
    const [showDrawer, setShowDrawer] = useState(false);

    useEffect(() => {
        isLogin();
    }, []);

    useEffect(() => {
        const { id } = router.query;
        if (id) {
            axios.get('/articles/' + id).then((res) => {
                const article = res.data;
                const category = article.category || {};
                setData({
                    title: article.title,
                    content: article.content || '',
                    category: category._id,
                    screenshot: [
                        {
                            uid: -1,
                            status: 'done',
                            url: article.screenshot,
                        },
                    ],
                    tags: article.tags,
                    summary: article.summary,
                    imgUrl: article.screenshot,
                });
                form.setFieldsValue({
                    title: article.title,
                    content: article.content || '',
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createArticle = (data) => {
        return axios.post('/articles', data);
    };

    const updateArticle = (id, data) => {
        return axios.put('/articles/' + id, data);
    };

    const publish = (data) => {
        const { id } = router.query;
        const content = editor.getMarkdown();
        if (!isLength(content, { min: 1, max: 100000 })) {
            return message.error('Chi ti???t b??i vi???t kh??ng th??? tr???ng v?? t???i ??a 15.000 k?? t???!');
        }
        Object.assign(data, {
            content,
            screenshot: data?.screenshot[0].url,
        });
        const p = id ? updateArticle(id, data) : createArticle(data);
        p.then(() => {
            message.success('g???i th??nh c??ng ???');
            Router.push('/admin/content/articles');
        });
    };

    const { id } = router.query;
    const debounceSetData = useMemo(
        () =>
            debounce((values: any) => {
                setData((data) => ({
                    ...data,
                    ...values,
                }));
            }),
        []
    );

    return (
        <Form.Provider
            onFormChange={(name, { forms }) => {
                if (name === 'articleConfigForm') {
                    const { articleConfigForm } = forms;
                    const values = articleConfigForm.getFieldsValue();
                    debounceSetData(values);
                }
            }}
            onFormFinish={(name, { values, forms }) => {
                if (name === 'contentForm') {
                    console.log('values l??: ', values);
                    setShowDrawer(true);
                } else {
                    const { contentForm } = forms;
                    const data = contentForm.getFieldsValue();
                    publish({ ...values, ...data });
                }
            }}
        >
            <div className={style.header}>
                <div className={style.leftItem}>
                    <div className={style.name}>
                        <Link href="/admin/content/articles" passHref={true}>
                            <a>
                                <ArrowLeftOutlined></ArrowLeftOutlined>
                                Danh s??ch b??i vi???t
                            </a>
                        </Link>
                    </div>
                    <div className={style.type}>{id ? 'Bi??n t???p b??i vi???t' : 'Th??m m???t b??i vi???t'}</div>
                </div>
                <div className={style.editorWrap}>
                    <Form form={form} initialValues={{ content: '' }} name="contentForm">
                        <Form.Item
                            name="title"
                            style={{ maxWidth: '700px', width: '100%', margin: '0 auto' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Ti??u ????? kh??ng th??? tr???ng! V?? nhi???u nh???t 160 k?? t???!',
                                    max: 160,
                                },
                            ]}
                        >
                            <TextArea placeholder="Vui l??ng nh???p ti??u ?????" rows={1} style={{ textAlign: 'center' }} />
                        </Form.Item>
                    </Form>
                </div>
                <section className="view-actions">
                    <Button
                        type="link"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        <SettingOutlined></SettingOutlined>
                        Th??m b??i vi???t
                    </Button>
                    <Drawer
                        formData={data}
                        visible={showDrawer}
                        onCancel={() => {
                            setShowDrawer(false);
                        }}
                    ></Drawer>
                </section>
            </div>
            <ToastuiEditor initialValue={data.content} getEditor={(e) => setEditor(e)}></ToastuiEditor>
        </Form.Provider>
    );
}
