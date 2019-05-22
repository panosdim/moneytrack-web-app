import React from 'react';
import { Card, Statistic, Icon, Row, Col } from 'antd';
import { useGlobal } from 'reactn';

export const SavingStatistics: React.FC = () => {
    const [income] = useGlobal('income');

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Card>
                    <Statistic
                        title='Active'
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<Icon type='arrow-up' />}
                        suffix='%'
                    />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic
                        title='Idle'
                        value={9.3}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<Icon type='arrow-down' />}
                        suffix='%'
                    />
                </Card>
            </Col>
        </Row>
    );
};
