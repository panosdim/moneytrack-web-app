import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm } from 'antd';
import axios from 'axios';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CategoryHandle } from '../components';
import { categoriesState, loginState } from '../model';

const { Meta } = Card;

export const CategoriesTab: React.FC = () => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const setLoggedIn = useSetRecoilState(loginState);

    const deleteCategory = (id: number) => {
        axios
            .delete(`category/${id}`)
            .then(() => {
                setCategories(categories.filter((cat) => cat.id !== id));
                message.success('Category deleted successfully!');
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setLoggedIn(false);
                    message.error(error.response.data.error);
                } else if (error.response && error.response.status === 409) {
                    message.error(error.response.data.error);
                } else {
                    message.error('Fail to delete Category!');
                }
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'row wrap' }}>
            {categories.map((category) => (
                <Card
                    key={category.id}
                    hoverable
                    style={{ width: '150px', margin: '10px' }}
                    actions={[
                        <Popconfirm
                            key={category.id}
                            title={`Are you sure delete this category?`}
                            onConfirm={() => deleteCategory(category.id)}
                            okText='Yes'
                            cancelText='No'
                        >
                            <Button type='primary' danger>
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>,
                        <CategoryHandle category={category} />,
                    ]}
                >
                    <Meta title={category.category} />
                </Card>
            ))}
        </div>
    );
};
