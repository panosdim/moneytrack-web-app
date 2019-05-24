import React from 'react';
import { Row, Col } from 'antd';
import { ExpensesTable, ExpensesStatistics } from '../components';

export const ExpensesTab: React.FC = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <ExpensesTable />
                </Col>
                <Col span={8}>
                    <ExpensesStatistics />
                </Col>
            </Row>
        </div>
    );
};
