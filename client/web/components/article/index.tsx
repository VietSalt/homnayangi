import Head from 'next/head';
import React from 'react';
import { wrapper } from '@blog/client/redux/store';
import ArticleItem from './article-item';
import WidgetArea from './widget-area';
import AppLayout from '@blog/client/web/layouts/app';
import {
    fetchArticle,
    fetchComments,
    fetchRecentArticles,
    useFetchArticleQuery,
    useFetchCommentsQuery,
    useFetchConfigQuery,
    useFetchRecentArticlesQuery,
} from '@blog/client/web/api';
import { useRouter } from 'next/router';
import { Col, Row } from 'antd';

const Page = () => {
    const router = useRouter();
    const { data: config } = useFetchConfigQuery();
    const { data: article } = useFetchArticleQuery(router.query.id as string);
    const {
        data: { items: comments },
    } = useFetchCommentsQuery(router.query.id as string);
    const { data: recentArticles = [] } = useFetchRecentArticlesQuery();
    return (
        <AppLayout>
            <Row>
                <Col>
                    <Head>
                        <title>{article.title + ' - ' + config.siteTitle}</title>
                    </Head>
                </Col>
                <Col xs={24} sm={24} xl={18}>
                    <ArticleItem article={article} comments={comments}></ArticleItem>
                </Col>
                <Col sm={24} xl={6}>
                    <WidgetArea recentArticles={recentArticles.slice(0, 5)}></WidgetArea>
                </Col>
            </Row>
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
    const { id } = context.query;
    await store.dispatch(fetchArticle.initiate(id));
    await store.dispatch(fetchComments.initiate(id));
    await store.dispatch(fetchRecentArticles.initiate());
    return {
        props: {},
    };
});

export default Page;
