import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Drawer } from 'antd';
import axios from '@blog/client/admin/axios';
import EditableTagGroup from '@blog/client/admin/components/EditableTagGroup';
import { DeleteFilled, SendOutlined } from '@ant-design/icons';
import useImageUpload from '@blog/client/admin/hooks/useImageUpload';
import style from './style.module.scss';
import ImageCropper from '@blog/client/admin/components/ImageCropper';

const Option = Select.Option;
const { TextArea } = Input;

export default function Index({ visible, onCancel, formData }) {
    const { setImageUrl, UploadButton, handleUpload } = useImageUpload({
        style: {
            width: '100%',
            minHeight: '80px',
        },
    });
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();

    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (formData) {
            setImageUrl(formData.imgUrl);
        }
        if (!visible && prevVisible) {
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    useEffect(() => {
        axios.get('/categories/').then((res) => {
            setCategories(res.data);
        });
    }, []);

    const categoryOptions =
        categories &&
        categories.map((category) => (
            <Option key={category._id} value={category._id}>
                {category.name}
            </Option>
        ));
    categoryOptions.push(
        <Option key={'đay la key'} value="Truyện cười">
            Haha
        </Option>
    );
    return (
        <Drawer
            width="340px"
            title="Cấu hình bài viết"
            placement="right"
            onClose={() => {
                if (onCancel) {
                    onCancel(false);
                }
            }}
            visible={visible}
        >
            <div className={style.drawerContent}>
                <Form layout="vertical" form={form} name="articleConfigForm" initialValues={formData}>
                    <Form.Item
                        required={true}
                        label="Ảnh bìa"
                        name="screenshot"
                        valuePropName="fileList"
                        getValueFromEvent={handleUpload}
                        rules={[{ required: false, message: 'Ảnh bìa không thể trống!' }]}
                    >
                        <ImageCropper minWidth={300} maxWidth={100000} minHeight={200} maxHeight={100000}>
                            <UploadButton></UploadButton>
                        </ImageCropper>
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Phân loại bài viết"
                        rules={[{ required: false, message: 'Phân loại không thể trống!' }]}
                    >
                        <Select placeholder="Hãy chọn một danh mục">{categoryOptions}</Select>
                    </Form.Item>
                    <Form.Item name="tags" label="Nhãn">
                        <EditableTagGroup />
                    </Form.Item>
                    <Form.Item
                        name="summary"
                        label="Tóm tắt"
                        rules={[
                            {
                                required: true,
                                message: 'Tóm tắt bài viết không thể trống và tối đa 800 ký tự!',
                                max: 800,
                            },
                        ]}
                    >
                        <TextArea placeholder="Vui lòng nhập tóm tắt bài viết" rows={4}></TextArea>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="link">
                            <SendOutlined />
                            Gửi
                        </Button>
                        <Button type="link" danger>
                            <DeleteFilled />
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
}
