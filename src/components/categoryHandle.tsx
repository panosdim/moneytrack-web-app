import { EditOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Input, message, Popover } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { categoriesState, loginState } from '../model';
import { categoryType } from '../model/data';

interface Props {
    category?: categoryType;
}

export const CategoryHandle: React.FC<Props> = (props: Props) => {
    const { category } = props;
    const [visible, setVisible] = useState(false);
    const [categoryName, setCategoryName] = useState(category ? category.category : '');
    const [categories, setCategories] = useRecoilState(categoriesState);
    const setLoggedIn = useSetRecoilState(loginState);

    const handleSave = () => {
        if (categoryName) {
            // Check if category name changed
            if (category && category.category === categoryName) {
                setVisible(false);
                return;
            }

            const method = category ? 'put' : 'post';
            const url = category ? `category/${category.id}` : 'category';
            const storeValues = { ...category, category: categoryName };

            axios({
                method: method,
                url: url,
                data: storeValues,
            })
                .then((response) => {
                    category
                        ? setCategories(categories.map((cat) => (cat.id === category.id ? response.data : cat)))
                        : setCategories([...categories, response.data]);

                    message.success('Category saved successfully!');
                    setVisible(false);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setVisible(false);
                        setLoggedIn(false);
                        message.error(error.response.data.error);
                    } else if (error.response && error.response.status === 422) {
                        message.error(error.response.data.error);
                    } else {
                        message.error('Fail to save Category!');
                    }
                });
        }
        setVisible(false);
    };

    const handleVisibleChange = (visible: boolean) => {
        setVisible(visible);
        category ? setCategoryName(category.category) : setCategoryName('');
    };

    const content = (
        <div>
            <p>
                <Input
                    value={categoryName}
                    placeholder='Enter Category Name'
                    suffix={<TagOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </p>
            <p>
                <Button type='primary' onClick={handleSave}>
                    Save
                </Button>
            </p>
        </div>
    );

    const title = category ? 'Edit Category' : 'Add New Category';
    const button = category ? (
        <Button type='primary'>
            <EditOutlined />
        </Button>
    ) : (
        <Button icon={<PlusOutlined />} type='primary'>
            Category
        </Button>
    );
    const placement = category ? 'bottom' : 'left';

    return (
        <Popover
            placement={placement}
            content={content}
            title={title}
            trigger='click'
            visible={visible}
            onVisibleChange={handleVisibleChange}
        >
            {button}
        </Popover>
    );
};
