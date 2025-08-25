"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PostCard } from "./PostCard"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Comment, Post } from "@/types"
import api from "@/lib/api/axios"
import { t } from "@/lib/i18n"

interface DetailPostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: Post;
}

export function DetailPostModal({ open, onOpenChange, post }: DetailPostModalProps) {
    const [comment, setComment] = useState<Comment>({
        id: "",
        postId: post.id,
        userId: "",
        user: {
            id: "",
            name: "",
            avatar: ""
        },
        content: "",
        createdAt: new Date()
    })
    
    const [commentList, setCommentList] = useState<Comment[]>([])

    const submitComment = async () => {
        try {
            const payload = {
                content: comment.content,
                ...(comment.parentId && { parentId: comment.parentId })
            }
            const response = await api.post(`/comments/posts/${post.id}`, payload)
            setCommentList(prev => [response.data, ...prev])
            setComment({ ...comment, content: "" })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/comments/posts/${post.id}`)
                setCommentList(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        open && fetchComments()
    }, [open, post.id])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-5xl p-2 rounded-lg overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Bài viết của {post.user.name}</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-6 overflow-x-auto">
                    <PostCard post={post} isDetail={true} />

                    <div className="px-6 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t('comments')}</h4>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {commentList.map(c => (
                                <div key={c.id} className="flex items-start gap-3">
                                    <img src={c.user?.avatar} alt={c.user?.name} className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">{c.user?.name}</div>
                                        <div className="text-xs text-gray-500 mb-1">{new Date(c.createdAt).toLocaleString()}</div>
                                        <div className="text-sm text-gray-800">{c.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Textarea
                                placeholder="Viết bình luận..."
                                value={comment.content}
                                onChange={e => setComment({ ...comment, content: e.target.value })}
                                className="flex-1 min-h-[40px] resize-none"
                            />
                            <Button
                                disabled={!comment.content.trim()}
                                size="sm"
                                onClick={submitComment}
                            >
                                {t('send')}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
