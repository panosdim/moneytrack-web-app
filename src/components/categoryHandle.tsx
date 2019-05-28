import React, { useState, useEffect } from 'react';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { message, Input, Icon, Button, Popover } from 'antd';
import { categoryType } from '../model';

interface Props {
    category?: categoryType;
}

export const CategoryHandle: React.FC<Props> = (props: Props) => {
    const { category } = props;
    const [visible, setVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useGlobal('categories');

    // TODO: Category Edit second time is not working
    useEffect(() => {
        if (category) {
            setCategoryName(category.category);
        }
    }, [category]);

    const handleSave = () => {
        // TODO: Check if category name changed before send the post
        if (categoryName) {
            const method = category ? 'put' : 'post';
            const url = category ? `category/${category.id}` : 'category';
            const storeValues = { ...category, category: categoryName };

            axios({
                method: method,
                url: url,
                data: storeValues,
            })
                .then(response => {
                    category
                        ? setCategories(categories.map(cat => (cat.id === category.id ? response.data.data : cat)))
                        : setCategories([...categories, response.data.data]);

                    message.success('Category saved successfully!');
                    setVisible(false);
                    setCategoryName('');
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setVisible(false);
                        setGlobal({ isLoggedIn: false });
                        message.error(error.response.data.error);
                    } else if (error.response && error.response.status === 422) {
                        message.error(error.response.data.error);
                    } else {
                        message.error('Fail to save Category!');
                    }
                });
        }
    };

    const handleVisibleChange = (visible: boolean) => {
        setVisible(visible);
    };

    const content = (
        <div>
            <p>
                <Input
                    value={categoryName}
                    placeholder='Enter Category Name'
                    suffix={<Icon type='tag' style={{ color: 'rgba(0,0,0,.45)' }} />}
                    onChange={e => setCategoryName(e.target.value)}
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
            <Icon type='edit' />
        </Button>
    ) : (
        <Button icon='plus' type='primary'>
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
