import React from 'react';
import { Card, Icon, Button } from 'antd';
import { useGlobal } from 'reactn';

const { Meta } = Card;

export const CategoriesTab: React.FC = () => {
    const [categories] = useGlobal('categories');

    const deleteCategory = id => {
        console.log(id);
    };

    const editCategory = id => {
        console.log(id);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'row wrap' }}>
            {categories.map(category => (
                <Card
                    key={category.id}
                    hoverable
                    style={{ width: '150px', margin: '10px' }}
                    actions={[
                        <Button onClick={() => deleteCategory(category.id)} type='danger'>
                            <Icon type='delete' />
                        </Button>,
                        <Button onClick={() => editCategory(category.id)} type='primary'>
                            <Icon type='edit' />
                        </Button>,
                    ]}
                >
                    <Meta title={category.category} />
                </Card>
            ))}
        </div>
    );
};
