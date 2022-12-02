import { parseTime } from '@blog/client/libs/time';
import { Breadcrumb } from 'antd';
import dynamic from 'next/dynamic';
import Link from '../link';
import style from './article-item.style.module.scss';
import Comment from './comment';
const ArticleAddress = dynamic(() => import('./article-address'), { ssr: false });
const MarkdownBody = dynamic(() => import('../markdown-body'), { ssr: false });

interface Props {
    article: any;
    comments: any[];
}

export default function ArticleItem(props: Props) {
    const { article, comments } = props;
    return (
        <div className={style.article}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href={'/blog/articles?cid=' + (article.category && article.category._id)} passHref={true}>
                        <a>{article.category && article.category.name}</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span>{article.title}</span>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className={style.articleMeta}>
                <Link href={`/blog/articles/${article._id}`} passHref={true}>
                    <a>
                        <h2 className={style.articleTitle}>{article.title}</h2>
                    </a>
                </Link>
            </div>
            <div className={style.articleContent}>
                <MarkdownBody content={article.content} />
            </div>

            <div className={style.statement}>
                <div>
                    <div className={style.articleMetaInfo}>
                        <span>Đăng lúc {parseTime(article.createdAt)}</span>
                        <span>
                            Danh mục <> </>
                            <Link
                                href={`/blog/articles?cid=${article.category && article.category._id}`}
                                passHref={true}
                            >
                                <a>{article.category && article.category.name}</a>
                            </Link>
                        </span>
                        <span>
                            {article.commentCount}
                            <> </> Bình luận
                        </span>
                        <span>Số lần đọc {article.viewsCount}</span>
                    </div>
                </div>
            </div>
            <div className={style.footer}>
                {article.prev && (
                    <div>
                        <strong>Trước：</strong>
                        <Link href={`/blog/articles/${article.prev._id}`} passHref={true}>
                            <a>{article.prev.title}</a>
                        </Link>
                    </div>
                )}
                {article.next && (
                    <div>
                        <strong>Tiếp theo：</strong>
                        <Link href={`/blog/articles/${article.next._id}`} passHref={true}>
                            <a>{article.next.title}</a>
                        </Link>
                    </div>
                )}
            </div>
            <Comment article={article} comments={comments}></Comment>
        </div>
    );
}
