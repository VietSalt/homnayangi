import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Categories from '../categories';
import ArticleItem from './item';
import AppLayout from '@blog/client/web/layouts/app';
import { useFetchArticlesQuery, fetchArticles, fetchCategories, useFetchConfigQuery } from '@blog/client/web/api';
import { Empty, Skeleton, Pagination, Row, Col } from 'antd';
import Link from '../link';
import { useRouter } from 'next/router';
import { isArray, toInteger } from 'lodash';
import { wrapper } from '@blog/client/redux/store';
import { isString } from 'markdown-it/lib/common/utils';
import { SearchForm } from '../app-header/search-form';

const Page = () => {
    const router = useRouter();
    const { data: config } = useFetchConfigQuery();
    const page = Number(router.query.page || 1);
    const cid: string = isArray(router.query.cid) ? router.query.cid.join(',') : router.query.cid || '';
    const tag: string = isArray(router.query.tag) ? router.query.tag.join(',') : router.query.tag || '';
    const { data = { items: [], totalCount: 0 }, isLoading } = useFetchArticlesQuery({ page, filter: { cid, tag } });
    const [innerWidth, setInnerWidth] = useState(1000);

    useEffect(() => {
        setInnerWidth(window.innerWidth);
        window.addEventListener('resize', () => {
            setInnerWidth(window.innerWidth);
        });
    }, []);
    console.log('inne', innerWidth);
    return (
        <AppLayout>
            <Head>
                <title>{config.siteTitle}</title>
                <link rel="shortcut icon" href="./assets/images/blogLogo.png "></link>
            </Head>

            {innerWidth < 576 && <SearchForm style={{ margin: 'auto', marginTop: '30px', marginBottom: '30px' }} />}

            <Categories></Categories>
            <div style={{ margin: '20px 0', padding: '0 20px' }}>
                {isLoading &&
                    new Array(10).fill('').map((_, index) => (
                        <div style={{ padding: '0 40px 20px' }} key={`article-item-loading-${index}`}>
                            <Skeleton active></Skeleton>
                        </div>
                    ))}
                {!isLoading && data.items.length <= 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Không có dữ liệu~~</span>} />
                ) : innerWidth > 576 ? (
                    <Row gutter={18}>
                        <Col xs={24} sm={12}>
                            {data.items.map((item, index) => {
                                return index % 2 === 0 && <ArticleItem item={item} key={item._id}></ArticleItem>;

                                // <div className={style.articleLayout}>
                            })}
                        </Col>
                        <Col xs={24} sm={12}>
                            {data.items.map((item, index) => {
                                return (
                                    index % 2 !== 0 && (
                                        <>
                                            <ArticleItem item={item} key={item._id}></ArticleItem>
                                        </>
                                    )
                                );
                                // <div className={style.articleLayout}>
                            })}
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col xs={24} sm={12}>
                            {data.items.map((item, index) => {
                                return <ArticleItem item={item} key={item._id}></ArticleItem>;

                                // <div className={style.articleLayout}>
                            })}
                        </Col>
                    </Row>
                )}
            </div>
            {data.totalCount > 0 && (
                <div style={{ display: 'flex', flex: '1 0 auto', justifyContent: 'center' }}>
                    <Pagination
                        itemRender={(page, type, originalElement) => {
                            if (page >= 1 && type == 'page') {
                                return (
                                    <Link href={`/blog/articles?page=${page}`} passHref={true}>
                                        <a>{page}</a>
                                    </Link>
                                );
                            }
                            return originalElement;
                        }}
                        defaultCurrent={page}
                        pageSize={10}
                        total={data.totalCount}
                    />
                </div>
            )}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
    const { page = 1, cid = '', tag = '' } = context.query;
    await store.dispatch(fetchCategories.initiate());
    await store.dispatch(
        fetchArticles.initiate({
            page: isString(page) ? toInteger(page) : 1,
            filter: {
                cid: isString(cid) ? cid : '',
                tag: isString(tag) ? tag : '',
            },
        })
    );
    return {
        props: {},
    };
});

export default Page;
