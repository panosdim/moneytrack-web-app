import React from 'react';
import { Row, Col } from 'antd';
import { IncomeTable, IncomeStatistics } from '../components';

export const IncomeTab: React.FC = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <IncomeTable />
                </Col>
                <Col span={8}>
                    <IncomeStatistics />
                </Col>
            </Row>
        </div>
    );
};
